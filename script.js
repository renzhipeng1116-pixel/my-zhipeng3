// 页面状态管理
class PageStateManager {
    constructor() {
        this.initialState = document.getElementById('initialState');
        this.loadingState = document.getElementById('loadingState');
        this.resultState = document.getElementById('resultState');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyAndOpenBtn = document.getElementById('copyAndOpenBtn');
        this.reviewText = document.getElementById('reviewText');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupReviewTextEditing();
    }
    
    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.handleGenerateReview());
        this.copyAndOpenBtn.addEventListener('click', () => this.handleCopyAndOpen());
    }
    
    // 显示初始状态
    showInitialState() {
        this.initialState.style.display = 'block';
        this.loadingState.style.display = 'none';
        this.resultState.style.display = 'none';
    }
    
    // 显示加载状态
    showLoadingState() {
        this.initialState.style.display = 'none';
        this.loadingState.style.display = 'block';
        this.resultState.style.display = 'none';
    }
    
    // 显示结果状态
    showResultState() {
        this.initialState.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.resultState.style.display = 'block';
    }
    
    // 处理生成好评
    async handleGenerateReview() {
        try {
            this.showLoadingState();
            this.generateBtn.disabled = true;
            
            // 模拟AI生成过程（实际项目中这里会调用真实的AI API）
            const review = await this.generateAIReview();
            
            this.reviewText.value = review;
            this.showResultState();
            
        } catch (error) {
            console.error('生成好评失败:', error);
            this.showError('生成失败，请重试');
            this.showInitialState();
        } finally {
            this.generateBtn.disabled = false;
        }
    }
    
    // 生成AI好评（模拟）
    async generateAIReview() {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 这里可以替换为真实的Gemini AI API调用
        const merchantName = document.querySelector('.merchant-name').textContent;
        const reviews = [
            `今天在${merchantName}的体验真的太棒了！服务一如既往地无微不至，让人感觉特别舒心。他们家的麻辣锅底是我的最爱，香辣过瘾，涮什么都好吃。整个过程非常愉快，绝对是朋友聚餐的首选！`,
            
            `${merchantName}的服务质量真的没话说！从进门到离开，每一个细节都处理得很到位。食材新鲜，味道正宗，环境也很舒适。下次还会再来，强烈推荐给大家！`,
            
            `在${merchantName}用餐的体验非常棒！服务员态度很好，菜品质量很高，价格也很合理。整个用餐过程很愉快，是值得推荐的好地方！`,
            
            `${merchantName}真的很不错！环境优雅，服务周到，菜品美味。特别是他们的特色菜，味道独特，让人回味无穷。服务员的专业素养也很高，整体体验非常满意！`
        ];
        
        // 随机选择一个好评模板
        const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
        return randomReview;
    }
    
    // 处理复制并打开应用
    async handleCopyAndOpen() {
        try {
            const reviewText = this.reviewText.value;
            
            // 复制到剪贴板
            await navigator.clipboard.writeText(reviewText);
            
            // 显示成功提示
            this.showSuccess('好评已复制到剪贴板！');
            
            // 尝试打开点评应用（这里以美团为例）
            this.openReviewApp();
            
        } catch (error) {
            console.error('复制失败:', error);
            this.showError('复制失败，请手动复制');
        }
    }
    
    // 打开点评应用
    openReviewApp() {
        // 尝试打开美团应用
        const meituanUrl = 'meituan://';
        const meituanWebUrl = 'https://www.meituan.com/';
        
        // 尝试打开应用，如果失败则打开网页版
        window.location.href = meituanUrl;
        
        // 延迟后如果还在当前页面，则打开网页版
        setTimeout(() => {
            if (document.hidden || document.webkitHidden) {
                return; // 如果页面已经隐藏，说明可能已经跳转
            }
            window.open(meituanWebUrl, '_blank');
        }, 1000);
    }
    
    // 设置评价文本编辑功能
    setupReviewTextEditing() {
        this.reviewText.addEventListener('click', () => {
            this.reviewText.readOnly = false;
            this.reviewText.focus();
        });
        
        this.reviewText.addEventListener('blur', () => {
            this.reviewText.readOnly = true;
        });
    }
    
    // 显示成功提示
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    // 显示错误提示
    showError(message) {
        this.showToast(message, 'error');
    }
    
    // 显示提示信息
    showToast(message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInDown 0.3s ease-out'
        });
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOutUp 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new PageStateManager();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加触摸反馈
document.addEventListener('touchstart', function() {}, {passive: true});

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 添加页面可见性检测
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时的处理
        console.log('页面已隐藏');
    } else {
        // 页面显示时的处理
        console.log('页面已显示');
    }
});
