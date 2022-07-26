const { pnpPlugin } = require("@yarnpkg/esbuild-plugin-pnp");
const { build } = require("esbuild");

main();

async function main() {
    const options = {
        platform: "node",
        entryPoints: ["./src/cli.ts"],
        outfile: "./dist/bundle.cjs",
        bundle: true,
        external: ["cpu-features"],
        plugins: [pnpPlugin()],
        define: {
            "process.env.PACKAGE_VERSION": getEnvironmentVariable("PACKAGE_VERSION"),
            "process.env.AUTH0_DOMAIN": getEnvironmentVariable("AUTH0_DOMAIN"),
            "process.env.AUTH0_CLIENT_ID": getEnvironmentVariable("AUTH0_CLIENT_ID"),
        },
    };

    function getEnvironmentVariable(environmentVariable) {
        const value = process.env[environmentVariable];
        if (value != null) {
            return `"${value}"`;
        }
        throw new Error(`Environment variable ${environmentVariable} is not defined.`);
    }

    await build(options).catch(() => process.exit(1));

    const path = require("path");
    process.chdir(path.join(__dirname, "dist"));

    // write cli's package.json
    const packageJson = require("./package.json");
    const { writeFile } = require("fs/promises");
    await writeFile(
        "package.json",
        JSON.stringify(
            {
                name: "fern-api",
                version: packageJson.version,
                repository: packageJson.repository,
                files: ["bundle.cjs"],
                bin: { fern: "bundle.cjs" },
            },
            undefined,
            2
        )
    );

    // write empty yarn.lock so yarn doesn't try to associate this package with the monorepo
    await writeFile("yarn.lock", "");

    // install package into new yarn.lock
    // YARN_ENABLE_IMMUTABLE_INSTALLS=false so we can modify yarn.lock even when in CI
    const { exec } = require("child_process");
    exec("YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install", undefined, (error) => {
        if (error != null) {
            console.error(error);
            process.exit(1);
        }
    });
}
