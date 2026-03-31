<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="logo">
            <div class="dolphin-logo-small">
              <svg viewBox="0 0 100 100" class="dolphin-svg-small">
                <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                      fill="#14B8A6"/>
                <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
              </svg>
            </div>
            <span class="logo-text">EDA365 AI</span>
          </div>
          <p>探索 AI 的无限可能</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>学习</h4>
            <a href="#tutorials">实战笔记</a>
            <a href="#navigation">AI网址导航</a>
            <a href="#">安装指南</a>
            <a href="#">命令手册</a>
          </div>
          <div class="footer-column">
            <h4>资源</h4>
            <a href="https://openclaw.ai/" target="_blank">OpenClaw官网</a>
            <a href="https://clawhub.ai/" target="_blank">ClawHub</a>
            <a href="https://docs.openclaw.ai/" target="_blank">官方文档</a>
          </div>
          <div class="footer-column">
            <h4>联系</h4>
            <a href="#">微信</a>
            <a href="#">邮箱</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} EDA365 AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-text-primary);
  color: white;
  padding: 60px 0 32px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dolphin-logo-small {
  width: 32px;
  height: 32px;
}

.dolphin-svg-small {
  width: 100%;
  height: 100%;
}

.footer-brand .logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  background: none;
  -webkit-text-fill-color: white;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 60px;
}

.footer-column h4 {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-column a {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin-bottom: 10px;
  transition: var(--transition-fast);
}

.footer-column a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 32px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 32px;
  }

  .footer-column {
    min-width: 120px;
  }
}
</style>
