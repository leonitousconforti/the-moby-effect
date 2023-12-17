// This is a commonJs script to run the generator so it can be called from heft
module.exports.runAsync = async () => {
    const { $ } = await import("execa");
    await $`npm run gen`;
};
