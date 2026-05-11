#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[97m';

const step = msg => console.log(`  ${CYAN}→${RESET}  ${WHITE}${msg}${RESET}`);
const ok = msg => console.log(`  ${GREEN}✓${RESET}  ${DIM}${msg}${RESET}`);
const warn = msg => console.log(`  ${YELLOW}⚠${RESET}  ${YELLOW}${msg}${RESET}`);
const fail = msg => console.log(`  ${RED}✗${RESET}  ${RED}${msg}${RESET}`);

function printHeader() {
  console.log(`  ${BOLD}${CYAN}◆ Eduzz Design Tokens${RESET}  ${DIM}sync${RESET}`);
  console.log(`  ${DIM}────────────────────────────────────${RESET}`);
}

function printFooter() {
  console.log();
  console.log(`  ${DIM}────────────────────────────────────${RESET}`);
  console.log(`  ${GREEN}${BOLD}✓ Tokens sincronizados com sucesso${RESET}`);
  console.log();
}

const TOKENS_URL = 'https://theme.rootzz.xyz/tokens.json';
const CSS_URL = 'https://theme.rootzz.xyz/index.css';

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..');

const DEST_TOKENS = join(PROJECT_DIR, 'src', 'theme', 'tokens.json');
const DEST_CSS = join(PROJECT_DIR, 'src', 'index.css');

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar ${url}`);
  return await res.text();
}

printHeader();

try {
  step('Baixando tokens.json...');
  const tokensText = await download(TOKENS_URL);
  JSON.parse(tokensText);
  mkdirSync(dirname(DEST_TOKENS), { recursive: true });
  writeFileSync(DEST_TOKENS, tokensText);
  ok('tokens.json atualizado em src/theme/tokens.json');

  step('Baixando index.css...');
  const cssText = await download(CSS_URL);
  mkdirSync(dirname(DEST_CSS), { recursive: true });
  writeFileSync(DEST_CSS, cssText);
  ok('index.css atualizado em src/index.css');

  printFooter();
} catch (err) {
  fail(err.message);
  warn('Mantendo arquivos locais existentes.');
  console.log();
  process.exit(0);
}
