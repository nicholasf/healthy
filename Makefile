.PHONY: test test-rust test-react install dev

test: test-rust test-react

test-rust:
	cd src-tauri && cargo test

test-react:
	pnpm test

install:
	pnpm install

dev:
	pnpm tauri dev
