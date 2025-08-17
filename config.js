// 配置文件 - 用户可以根据需要修改这些设置

const CONFIG = {
    // 商家信息配置
    merchant: {
        name: "志鹏的火锅店",
        welcomeText: "感谢您的光临！您的肯定是我们最大的动力。",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjBMMjAgMTJMMjggMjBIMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMjhMMjAgMjBMMjggMjhIMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
    },
    
    // AI生成配置
    ai: {
        // 是否启用真实AI API（false时使用模拟数据）
        enableRealAPI: false,
        
        // 真实AI API配置
        api: {
            endpoint: "https://your-ai-api.com/generate",
            apiKey: "your-api-key-here",
            model: "gemini-pro"
        },
        
        // 模拟生成延迟（毫秒）
        mockDelay: 2000,
        
        // 好评模板（当enableRealAPI为false时使用）
        templates: [
            "今天在{merchantName}的体验真的太棒了！服务一如既往地无微不至，让人感觉特别舒心。他们家的番茄锅底是我的最爱，浓郁开胃，涮什么都好吃。整个过程非常愉快，绝对是朋友聚餐的首选！",
            
            "{merchantName}的服务质量真的没话说！从进门到离开，每一个细节都处理得很到位。食材新鲜，味道正宗，环境也很舒适。下次还会再来，强烈推荐给大家！",
            
            "在{merchantName}用餐的体验非常棒！服务员态度很好，菜品质量很高，价格也很合理。整个用餐过程很愉快，是值得推荐的好地方！",
            
            "{merchantName}真的很不错！环境优雅，服务周到，菜品美味。特别是他们的特色菜，味道独特，让人回味无穷。服务员的专业素养也很高，整体体验非常满意！"
        ]
    },
    
    // 应用跳转配置
    apps: {
        // 主要目标应用（优先尝试打开）
        primary: {
            name: "美团",
            scheme: "meituan://",
            webUrl: "https://www.meituan.com/"
        },
        
        // 备用应用列表
        fallback: [
            {
                name: "大众点评",
                scheme: "dianping://",
                webUrl: "https://www.dianping.com/"
            },
            {
                name: "小红书",
                scheme: "xiaohongshu://",
                webUrl: "https://www.xiaohongshu.com/"
            }
        ]
    },
    
    // 页面配置
    page: {
        title: "NFC一触即评智能助手",
        mainTitle: "只需一步，轻松留下您的五星好评",
        generateButtonText: "✨ 一键生成专属好评",
        assistantText: "我们将调用Gemini AI模型，为您智能生成一段真诚、个性化的赞美。",
        resultTitle: "为您生成的好评如下：",
        editHint: "点击可编辑",
        finalButtonText: "📱 复制好评并打开点评App",
        finalHint: "跳转后，在新页面长按粘贴即可发送。",
        techSupport: "任志鹏啊志鹏支持"
    },
    
    // 样式配置
    style: {
        // 主色调
        primaryColor: "#667eea",
        secondaryColor: "#56ab2f",
        
        // 背景渐变
        backgroundGradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        
        // 按钮样式
        buttonRadius: "50px",
        buttonShadow: "0 8px 25px rgba(102, 126, 234, 0.4)"
    },
    
    // 功能开关
    features: {
        // 是否启用编辑功能
        enableEditing: true,
        
        // 是否启用复制功能
        enableCopy: true,
        
        // 是否启用应用跳转
        enableAppJump: true,
        
        // 是否启用动画效果
        enableAnimations: true,
        
        // 是否启用触摸反馈
        enableTouchFeedback: true
    },
    
    // 性能配置
    performance: {
        // 页面加载动画时长
        pageLoadDuration: 500,
        
        // Toast提示显示时长
        toastDuration: 3000,
        
        // 应用跳转超时时间
        appJumpTimeout: 1000
    }
};

// 导出配置（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全局访问配置
window.APP_CONFIG = CONFIG;
