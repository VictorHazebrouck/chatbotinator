import { $, Glob } from "bun";

const glob = new Glob("{apps,packages}/*");
const dirs = Array.from(glob.scanSync({ onlyFiles: false }));

const NODE_MODULES = "./node_modules";
const BUN_LOCK = "./bun.lock";
const EXPO_CACHE = "./.expo";
const NEXT_CACHE = "./.next";

$`rm ${BUN_LOCK}`.quiet().then();
$`rm -rf ${NODE_MODULES}`.quiet().then();

for (const dir of dirs) {
	$`cd ${dir} && rm ${BUN_LOCK}`.quiet().then();
	$`cd ${dir} && rm -rf ${NODE_MODULES}`.quiet().then();
	$`cd ${dir} && rm -rf ${EXPO_CACHE}`.quiet().then();
	$`cd ${dir} && rm -rf ${NEXT_CACHE}`.quiet().then();
}
