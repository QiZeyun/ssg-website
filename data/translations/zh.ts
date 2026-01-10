/**
 * 中文翻译（基准语言）
 * 此文件定义了所有翻译键的结构，其他语言文件必须遵循相同的结构
 */

export const zh = {
  nav: {
    home: '首页',
    about: '关于我们',
    pricing: '价格',
    contact: '联系我们',
  },
  common: {
    learnMore: '了解更多',
    getStarted: '立即开始',
    contactUs: '联系我们',
    language: '语言',
  },
  home: {
    title: '欢迎来到您的公司',
    subtitle: '我们为您的业务需求提供创新解决方案。探索我们的服务，了解我们如何帮助您成功。',
    feature1: {
      title: '功能 1',
      description: '您的第一个功能或服务的描述。',
    },
    feature2: {
      title: '功能 2',
      description: '您的第二个功能或服务的描述。',
    },
    feature3: {
      title: '功能 3',
      description: '您的第三个功能或服务的描述。',
    },
  },
  about: {
    title: '关于我们',
    subtitle: '了解更多关于我们公司的信息、我们的使命和价值观。',
  },
  contact: {
    title: '联系我们',
    subtitle: '有疑问或想与我们合作？请填写下面的表单，我们会尽快回复您。',
    form: {
      name: '姓名',
      email: '邮箱',
      message: '留言',
      send: '发送消息',
      sending: '发送中...',
      success: '感谢您的留言！我们会尽快回复您。',
      error: '出错了，请稍后重试。',
    },
    otherWays: '其他联系方式',
    email: '邮箱',
    phone: '电话',
    address: '地址',
  },
  pricing: {
    title: '价格',
    subtitle: '选择适合您的套餐',
    monthly: '月付',
    yearly: '年付',
    save: '节省',
    perMonth: '/月',
    perMonthYearly: '/月（年付）',
    yearlyLabel: '年付',
    yearlyBilled: 'Yearly',
    savePercent: '节省 {{percent}}%',
    getStarted: '立即开始',
    faq: {
      title: '常见问题',
    },
  },
} as const;

/**
 * 中文翻译类型（用于约束其他语言文件）
 */
export type ZhTranslations = typeof zh;
