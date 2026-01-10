# Git Hooks 配置说明

## Pre-commit Hook

在每次提交代码前，会自动运行以下检查，确保代码质量：

### 检查项

1. **Lint-staged** - 只检查暂存的文件
   - 自动修复 ESLint 错误（仅限 `.ts` 和 `.tsx` 文件）
   - 如果没有匹配的文件，会静默跳过

2. **类型检查** (`pnpm type-check`)
   - 运行 TypeScript 编译器检查类型错误
   - 如果发现类型错误，提交会被阻止

3. **代码检查** (`pnpm lint`)
   - 运行 ESLint 检查代码规范
   - 如果发现代码规范问题，提交会被阻止

4. **构建产物验证** (`pnpm validate`)
   - 验证构建产物是否符合预期（如果 `out/` 目录存在）
   - 如果构建产物不存在，会跳过此检查（避免每次提交都构建）

### 如何跳过检查（不推荐）

如果需要临时跳过 pre-commit 检查，可以使用：

```bash
git commit --no-verify -m "your message"
```

⚠️ **注意**：跳过检查可能导致代码质量问题，请谨慎使用。

### 故障排查

#### 检查失败时如何修复

1. **类型检查失败**
   ```bash
   pnpm type-check
   # 修复类型错误后重新提交
   ```

2. **代码检查失败**
   ```bash
   pnpm lint
   # 修复代码规范问题后重新提交
   # 或使用 pnpm lint --fix 自动修复
   ```

3. **构建产物验证失败**
   ```bash
   pnpm build
   pnpm validate
   # 修复问题后重新提交
   ```

#### 禁用某个检查（临时）

如果需要临时禁用某个检查，可以编辑 `.husky/pre-commit` 文件，注释掉相应的行。

#### 重新初始化 Husky

如果 hooks 不工作，可以重新初始化：

```bash
# 删除 .husky 目录
rm -rf .husky

# 重新初始化
pnpm exec husky init

# 重新创建 pre-commit hook
# （复制之前的内容）
```

### 配置说明

- **lint-staged 配置**: `.lintstagedrc.json`
- **Pre-commit 检查脚本**: `scripts/pre-commit-check.ts`
- **Husky 配置文件**: `.husky/pre-commit`

### 相关命令

```bash
# 手动运行 pre-commit 检查（不提交）
pnpm pre-commit:check

# 手动运行类型检查
pnpm type-check

# 手动运行代码检查
pnpm lint

# 手动验证构建产物
pnpm validate

# 跳过 hooks 提交（不推荐）
git commit --no-verify
```
