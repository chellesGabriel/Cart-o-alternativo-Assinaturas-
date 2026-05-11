#!/usr/bin/env node
import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const WHITE = '\x1b[97m';

const step = msg => console.log(`  ${CYAN}→${RESET}  ${WHITE}${msg}${RESET}`);
const ok = msg => console.log(`  ${GREEN}✓${RESET}  ${DIM}${msg}${RESET}`);
const warn = msg => console.log(`  ${YELLOW}⚠${RESET}  ${YELLOW}${msg}${RESET}`);

function printHeader() {
  console.log(`  ${BOLD}${CYAN}◆ Eduzz Design Rules${RESET}  ${DIM}sync${RESET}`);
  console.log(`  ${DIM}────────────────────────────────────${RESET}`);
}

function printFooter() {
  console.log();
  console.log(`  ${DIM}────────────────────────────────────${RESET}`);
  console.log(`  ${GREEN}${BOLD}✓ Regras sincronizadas com sucesso${RESET}`);
  console.log();
}

function run(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: 'pipe' });
  } catch {
    // silencia erros de rede / git, igual ao `|| true` do bash
  }
}

function copyDir(src, dst) {
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dst, { recursive: true });
  cpSync(src, dst, { recursive: true, force: true });
}

const RULES_REPO = 'https://github.com/eduzz-design/claude-design-rules.git';
const CACHE_DIR = join(homedir(), '.design-rules-cache');
const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..');

printHeader();

if (!existsSync(join(CACHE_DIR, '.git'))) {
  step('Clonando repositório de regras...');
  run(`git clone --depth 1 ${RULES_REPO} "${CACHE_DIR}"`);
  ok('Repositório clonado');
} else {
  step('Verificando atualizações...');
  run(`git -C "${CACHE_DIR}" pull --ff-only --quiet`);
  ok('Cache atualizado');
}

if (!existsSync(CACHE_DIR)) {
  warn('Cache não encontrado e sem acesso à rede. Pulando sync.');
  console.log();
  process.exit(0);
}

const RULES_ROOT = existsSync(join(CACHE_DIR, '.claude')) ? join(CACHE_DIR, '.claude') : CACHE_DIR;

for (const folder of ['skills', 'agents', 'commands', 'docs']) {
  const src = join(RULES_ROOT, folder);
  const dst = join(PROJECT_DIR, '.claude', folder);

  if (existsSync(src)) {
    step(`Sincronizando ${BOLD}${folder}${RESET}...`);
    copyDir(src, dst);
    ok(`${folder} sincronizado`);
  }
}

const settingsSrc = join(RULES_ROOT, 'settings.json');

if (existsSync(settingsSrc)) {
  step('Copiando settings.json...');
  cpSync(settingsSrc, join(PROJECT_DIR, '.claude', 'settings.json'));
  ok('settings.json atualizado');
}

const claudeMdSrc = join(CACHE_DIR, 'CLAUDE.md');

if (existsSync(claudeMdSrc)) {
  step('Copiando CLAUDE.md...');
  cpSync(claudeMdSrc, join(PROJECT_DIR, 'CLAUDE.md'));
  ok('CLAUDE.md atualizado');
}

printFooter();
