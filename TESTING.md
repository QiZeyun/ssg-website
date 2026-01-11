# 测试指南

## 概述

本项目使用 **Jest** 和 **React Testing Library** 作为测试框架，遵循行为驱动测试（Behavior-Driven Testing）的原则。

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Jest | ^30.2.0 | 测试运行器和断言库 |
| @testing-library/react | ^16.3.1 | React 组件测试工具 |
| @testing-library/jest-dom | ^6.9.1 | DOM 断言扩展 |
| @testing-library/user-event | ^14.6.1 | 用户交互模拟 |
| jest-environment-jsdom | ^30.2.0 | 浏览器环境模拟 |

## 快速开始

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式（开发时使用）
pnpm test:watch

# CI 环境运行
pnpm test:ci
```

### 项目结构

```
__tests__/
├── ContactForm.test.tsx       # 联系表单组件测试
├── LanguageSwitcher.test.tsx  # 语言切换组件测试
└── MarkdownContent.test.tsx   # Markdown 内容组件测试
```

## 测试配置

### Jest 配置

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/out/'],
};

module.exports = createJestConfig(customJestConfig);
```

### 测试环境设置

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
```

## 测试规范

### 核心原则

**测试组件的行为和公共 API，而不是实现细节。**

#### ✅ 推荐做法

1. **从用户角度测试**
   - 测试组件的输入（props）和输出（渲染的 DOM、事件）
   - 使用用户可见的元素进行断言（文本、角色、标签）

2. **最小化 Mock**
   - 仅 Mock 外部依赖（API、第三方库）
   - 避免 Mock 自己的代码

3. **测试真实效果**
   - 测试用户能看到的实际行为
   - 验证组件的契约（contract）

#### ❌ 避免做法

1. 测试实现细节（内部状态、私有方法）
2. 过度 Mock（Mock 所有依赖）
3. 测试框架代码（如 React hooks 是否被调用）

### 测试命名规范

```typescript
describe('ComponentName', () => {
  it('should [expected behavior] when [condition]', () => {
    // 测试代码
  });
});
```

## 现有测试用例

### 1. ContactForm 测试

测试联系表单的提交流程和表单重置功能。

```typescript
// __tests__/ContactForm.test.tsx
describe('ContactForm', () => {
  it('submits successfully and resets the form', async () => {
    // 1. 渲染组件
    render(<ContactForm locale={locale} />);

    // 2. 填写表单
    await user.type(screen.getByLabelText(t(locale, 'contact.form.name')), 'Alice');
    await user.type(screen.getByLabelText(t(locale, 'contact.form.email')), 'alice@example.com');
    await user.type(screen.getByLabelText(t(locale, 'contact.form.message')), 'Hello');

    // 3. 提交表单
    await user.click(screen.getByRole('button', { name: t(locale, 'contact.form.send') }));

    // 4. 验证提交状态
    expect(screen.getByRole('button', { name: t(locale, 'contact.form.sending') })).toBeDisabled();

    // 5. 验证成功状态和表单重置
    expect(screen.getByText(t(locale, 'contact.form.success'))).toBeInTheDocument();
    expect(screen.getByLabelText(t(locale, 'contact.form.name'))).toHaveValue('');
  });
});
```

**测试要点**：
- 使用 `userEvent` 模拟真实用户交互
- 通过标签文本和按钮角色定位元素
- 使用翻译函数 `t()` 确保多语言兼容
- 使用 `jest.useFakeTimers()` 控制异步操作

### 2. LanguageSwitcher 测试

测试语言切换下拉菜单的交互行为。

```typescript
// __tests__/LanguageSwitcher.test.tsx
describe('LanguageSwitcher', () => {
  it('opens dropdown and closes with Escape', async () => {
    // 1. 渲染组件
    render(<LanguageSwitcher locale={locale} currentPath="/zh/about" />);

    // 2. 验证初始状态
    expect(screen.queryByRole('link', { name: /English/ })).not.toBeInTheDocument();

    // 3. 打开下拉菜单
    await user.click(button);
    expect(screen.getByRole('link', { name: /English/ })).toHaveAttribute('href', '/en/about');

    // 4. 按 Escape 关闭
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('link', { name: /English/ })).not.toBeInTheDocument();
  });
});
```

**测试要点**：
- Mock `next/link` 组件以测试路由链接
- 测试键盘交互（Escape 键）
- 验证链接的 href 属性

### 3. MarkdownContent 测试

测试 Markdown 内容的 HTML 渲染。

```typescript
// __tests__/MarkdownContent.test.tsx
describe('MarkdownContent', () => {
  it('renders given HTML content', () => {
    const { container } = render(
      <MarkdownContent content="<h1>Hello</h1><p><strong>Bold</strong></p>" />
    );

    expect(container.querySelector('h1')).toHaveTextContent('Hello');
    expect(container.querySelector('strong')).toHaveTextContent('Bold');
  });
});
```

**测试要点**：
- 测试 HTML 内容是否正确渲染
- 使用 `container.querySelector` 定位 DOM 元素

## 编写新测试

### 1. 创建测试文件

在 `__tests__/` 目录下创建 `ComponentName.test.tsx`：

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/components/ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. 常用测试模式

#### 测试用户交互

```typescript
it('should handle click events', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await user.click(screen.getByRole('button', { name: 'Click me' }));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 测试表单输入

```typescript
it('should update input value', async () => {
  const user = userEvent.setup();
  
  render(<Input label="Name" />);
  
  await user.type(screen.getByLabelText('Name'), 'John');
  
  expect(screen.getByLabelText('Name')).toHaveValue('John');
});
```

#### 测试异步操作

```typescript
it('should load data asynchronously', async () => {
  render(<DataLoader />);
  
  // 等待加载完成
  await screen.findByText('Data loaded');
  
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

#### 测试条件渲染

```typescript
it('should show error message when validation fails', async () => {
  const user = userEvent.setup();
  
  render(<Form />);
  
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('This field is required')).toBeInTheDocument();
});
```

### 3. Mock 外部依赖

#### Mock Next.js 组件

```typescript
// Mock next/link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));
```

#### Mock API 请求

```typescript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
  })
) as jest.Mock;
```

## 查询优先级

根据 Testing Library 的最佳实践，按以下优先级选择查询方法：

### 1. 可访问性查询（推荐）

```typescript
// 最推荐：按角色查询
screen.getByRole('button', { name: 'Submit' })
screen.getByRole('textbox', { name: 'Email' })
screen.getByRole('heading', { level: 1 })

// 按标签文本查询
screen.getByLabelText('Email address')

// 按占位符文本查询
screen.getByPlaceholderText('Enter your email')

// 按文本内容查询
screen.getByText('Welcome')
```

### 2. 语义查询

```typescript
// 按 alt 文本查询（图片）
screen.getByAltText('Company logo')

// 按 title 属性查询
screen.getByTitle('Close')
```

### 3. 测试 ID 查询（最后选择）

```typescript
// 仅在其他方法都不适用时使用
screen.getByTestId('custom-element')
```

## 断言方法

### 常用断言

```typescript
// 元素存在
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// 文本内容
expect(element).toHaveTextContent('text');

// 表单值
expect(input).toHaveValue('value');

// 属性
expect(link).toHaveAttribute('href', '/path');

// 状态
expect(button).toBeDisabled();
expect(button).toBeEnabled();
expect(checkbox).toBeChecked();

// 可见性
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// CSS 类
expect(element).toHaveClass('active');

// 样式
expect(element).toHaveStyle({ color: 'red' });
```

## 调试技巧

### 1. 打印 DOM 结构

```typescript
screen.debug();  // 打印整个 DOM
screen.debug(element);  // 打印特定元素
```

### 2. 使用 logRoles

```typescript
import { logRoles } from '@testing-library/dom';

const { container } = render(<Component />);
logRoles(container);  // 打印所有可用的角色
```

### 3. 检查 Mock 调用

```typescript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(1);
console.log(mockFn.mock.calls);  // 查看所有调用
```

## CI/CD 集成

### GitHub Actions 配置

测试已集成到 CI/CD 流程中：

```yaml
# .github/workflows/deploy.yml
- name: Run tests
  run: pnpm test:ci
```

### 测试覆盖率

可以通过以下命令生成测试覆盖率报告：

```bash
pnpm test -- --coverage
```

## 最佳实践总结

1. **测试行为，不测试实现**
   - 问自己："如果我完全重写组件但保持相同的 API，测试是否仍然通过？"

2. **使用真实的用户交互**
   - 使用 `userEvent` 而不是 `fireEvent`
   - 模拟真实的用户操作流程

3. **保持测试独立**
   - 每个测试应该独立运行，不依赖其他测试的状态
   - 在 `beforeEach` 中重置必要的状态

4. **编写有意义的测试描述**
   - 使用清晰的 `describe` 和 `it` 描述
   - 测试失败时，描述应该能帮助定位问题

5. **避免过度测试**
   - 不要测试第三方库的功能
   - 专注于组件的核心功能

## 相关资源

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library 查询优先级](https://testing-library.com/docs/queries/about#priority)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
