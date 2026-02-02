import React, { useState, useRef, useMemo, useEffect } from "react";
import ProjectTicker from "../ProjectTicker";
import blogPosts from "@site/src/data/blogPosts.json";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useHistory } from "@docusaurus/router";
import Typewriter from 'typewriter-effect';

// --- Constants & Helpers ---

const THEMES = [
  {
      mainColor: 'tw-text-blue-400', // 亮蓝色 (Blue-400)
      glowColor: '#3b82f6', // 亮蓝光晕 (Blue-500)
      glowRgba: '59, 130, 246',
      codeColor: '#60a5fa', // 更亮的蓝 (Blue-400)
      timeColor: 'tw-text-blue-300' // 浅蓝色时间
  }
];

const DANMAKU_TRACKS = [10, 16, 22, 28, 34];

const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-');
};

/**
 * 弹幕单项组件
 * 用于在背景中显示滚动的博客文章标题
 */
interface DanmakuItemProps {
    post: {
        title: string;
        permalink: string;
    };
    top: string;
    duration: number;
    delay: number;
}

const DanmakuItem: React.FC<DanmakuItemProps> = React.memo(({ post, top, duration, delay }) => {
  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: "-100%" }}
      transition={{
        repeat: Infinity,
        duration: duration,
        delay: delay,
        ease: "linear",
      }}
      className="tw-absolute tw-whitespace-nowrap tw-z-0 hover:tw-z-50"
      style={{ top }}
    >
      <Link
        to={post.permalink}
        className="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-rounded-full tw-border tw-border-white/50 tw-text-white hover:tw-text-blue-400 hover:tw-border-blue-400 tw-transition-all tw-duration-300 no-underline hover:no-underline tw-text-sm md:tw-text-base tw-backdrop-blur-sm"
        style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px", textShadow: "0 0 5px rgba(255,255,255,0.3)" }}
      >
        <span className="tw-mr-2 tw-text-blue-400">•</span>
        {post.title}
      </Link>
    </motion.div>
  );
});

const Hero = () => {
  const history = useHistory();
  const [isClicked, setIsClicked] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 背景资源
  const pcBgUrl = useBaseUrl("/img/pc-bg.mp4");
  const mobileBgUrl = useBaseUrl("/img/mobile-bg.mp4");
  
  // 移动端视频控制状态
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  const currentTheme = THEMES[loopCount % THEMES.length];

  // 实时时间状态
  useEffect(() => {
    const updateTime = () => {
        const timeString = getFormattedTime();
        // 直接更新 DOM 元素，实现打字机后的动态时间效果
        const clockEl = document.getElementById('hero-clock');
        if (clockEl) {
            clockEl.innerText = timeString;
        }
    };
    
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 切换视频播放状态
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 处理“开始阅读”点击事件
  const handleRandomRead = () => {
    setIsClicked(true);
    
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setIsPlaying(true);
      if (videoRef.current) videoRef.current.play();
      
      // 移动端：播放5秒视频动画后跳转
      setTimeout(() => {
        history.push('/blog');
      }, 5000);
    } else {
      // PC端：直接跳转
      history.push('/blog');
    }
  };

  // 生成弹幕轨道配置
  const danmakuItems = useMemo(() => (blogPosts || []).map((post, index) => {
      return {
          post,
          track: index % DANMAKU_TRACKS.length,
          duration: 20 + Math.random() * 10, 
          delay: index * 3 
      };
  }), []);

  return (
    <div className="tw-relative tw-h-[calc(100svh-60px)] md:tw-h-[calc(100vh-60px)] tw-bg-gray-50 dark:tw-bg-black tw-text-gray-900 dark:tw-text-white tw-overflow-hidden tw-flex tw-flex-col tw--mt-[60px] tw-pt-[60px]">
        {/* 背景层 */}
        <div className="tw-absolute tw-inset-0 tw-z-0 tw-overflow-hidden">
            {/* 移动端背景 (视频) */}
            <div className="tw-block md:tw-hidden tw-relative tw-w-full tw-h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="tw-w-full tw-h-full tw-object-cover"
                    poster={useBaseUrl("/img/pc-bg.png")}
                >
                    <source src={mobileBgUrl} type="video/mp4" />
                </video>
                {/* 移动端播放/暂停控制按钮 */}
                <button
                    onClick={togglePlay}
                    className={`tw-absolute tw-bottom-24 tw-right-6 tw-z-20 tw-p-3 tw-bg-black/30 hover:tw-bg-black/50 tw-rounded-full tw-text-white/80 hover:tw-text-white tw-backdrop-blur-sm tw-transition-all tw-duration-300 ${isClicked ? 'tw-opacity-0' : 'tw-opacity-100'}`}
                    aria-label={isPlaying ? "Pause background" : "Play background"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
            </div>

            {/* PC端背景 (视频) */}
            <div className="tw-hidden md:tw-block tw-w-full tw-h-full">
                <video
                    ref={pcVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="tw-w-full tw-h-full tw-object-cover tw-absolute tw-inset-0"
                >
                    <source src={pcBgUrl} type="video/mp4" />
                </video>
            </div>
        </div>

        {/* 弹幕层 */}
        <div className={`tw-absolute tw-inset-0 tw-z-10 tw-overflow-hidden tw-pointer-events-none tw-transition-opacity tw-duration-1000 ${isClicked ? 'tw-opacity-0 md:tw-opacity-100' : 'tw-opacity-100'}`}>
            <div className="tw-relative tw-w-full tw-h-full tw-pointer-events-auto">
                {danmakuItems.map((item, index) => (
                    <DanmakuItem 
                        key={index}
                        post={item.post}
                        top={`${DANMAKU_TRACKS[item.track]}%`}
                        duration={item.duration}
                        delay={item.delay}
                    />
                ))}
            </div>
        </div>

        {/* 主要内容区域 (居中) */}
        <div className={`tw-relative tw-z-20 tw-container tw-mx-auto tw-px-4 tw-pt-12 md:tw-pt-20 tw-pb-4 md:tw-pb-12 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center text-center tw-transition-opacity tw-duration-1000 ${isClicked ? 'tw-opacity-0 md:tw-opacity-100' : 'tw-opacity-100'}`}>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 className="tw-text-center tw-space-y-4 md:tw-space-y-8 tw-w-full tw-flex tw-flex-col tw-items-center"
            >
                {/* 打字机效果区域 */}
                <div className="tw-h-[220px] md:tw-h-[300px] md:[@media(max-height:800px)]:tw-h-[200px] tw-w-full tw-max-w-4xl tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
                    <div ref={textRef} className={`tw-text-lg md:tw-text-2xl tw-font-bold ${currentTheme.mainColor} tw-tracking-widest tw-transition-opacity tw-duration-1000 tw-leading-loose tw-text-center tw-w-full tw-whitespace-pre-wrap tw-break-words`} style={{ fontFamily: "'Orbitron', sans-serif", textShadow: `0 0 10px rgba(${currentTheme.glowRgba}, 0.8), 0 0 20px rgba(${currentTheme.glowRgba}, 0.4)` }}>
                        <Typewriter
                            onInit={(typewriter) => {
                                const timeString = getFormattedTime();
                                typewriter
                                    .changeDelay(40)
                                    .typeString('> INITIALIZING_TEMPORAL_SCAN...<br/>')
                                    .pauseFor(300)
                                    .typeString('> DETECTING_FLOW: -1s... -1m... -1h...<br/>')
                                    .pauseFor(300)
                                    .typeString('> WARNING: TIME_IS_NON_REFUNDABLE<br/>')
                                    .pauseFor(800)
                                    .deleteAll(1)
                                    .typeString(`<span style="color: white; text-shadow: 0 0 10px white, 0 0 20px ${currentTheme.codeColor}; font-size: 1.2em;">"if (t == NOW) { return CHERISH; } else { return VOID; }"</span>`)
                                    .pauseFor(3000)
                                    .callFunction(() => {
                                        if (textRef.current) {
                                            textRef.current.style.opacity = '0';
                                        }
                                    })
                                    .pauseFor(1000)
                                    .deleteAll(1)
                                    .callFunction(() => {
                                        if (textRef.current) {
                                            textRef.current.style.opacity = '1';
                                        }
                                    })
                                    .typeString(`<span style="color: #fff; font-size: 1.3em; font-weight: bold; text-shadow: 0 0 10px #fff, 0 0 20px ${currentTheme.glowColor}, 0 0 40px ${currentTheme.glowColor};">"时间易逝，感受当下。"</span><br/>`)
                                    .pauseFor(500)
                                    .typeString(`<span class="tw-text-sm ${currentTheme.timeColor} tw-opacity-90" style="text-shadow: 0 0 5px rgba(${currentTheme.glowRgba}, 0.5);">SYSTEM_TIME: <span id="hero-clock">${timeString}</span></span>`)
                                    .pauseFor(5000)
                                    .callFunction(() => {
                                        setLoopCount((prev) => prev + 1);
                                    })
                                    .start();
                            }}
                            options={{
                                autoStart: true,
                                loop: false,
                                cursor: '█',
                                delay: 40,
                            }}
                        />
                    </div>
                </div>

                <div className="tw-pt-4">
                    <button
                        onClick={handleRandomRead}
                        disabled={isClicked}
                        className={`tw-group tw-relative tw-inline-flex tw-items-center tw-gap-3 tw-px-8 tw-py-4 tw-bg-white/10 tw-backdrop-blur-md tw-border tw-text-white tw-rounded-full tw-font-bold tw-text-lg tw-shadow-xl tw-transition-all tw-duration-300 tw-overflow-hidden ${isClicked ? 'tw-border-t-transparent tw-border-l-transparent tw-border-r-white/50 tw-border-b-white/50 tw-animate-spin' : 'tw-border-white/30'}`}
                        style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "2px", animationDuration: isClicked ? "1s" : "0s" }}
                    >
                        <span className={`tw-relative tw-z-10 tw-flex tw-items-center tw-gap-2 ${isClicked ? 'tw-opacity-0' : 'tw-opacity-100'}`}>
                            开始阅读
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>

        {/* 精选作品区域 */}
        <div className={`tw-relative tw-z-20 tw-mt-auto tw-pb-2 tw-shrink-0 tw-transition-opacity tw-duration-1000 ${isClicked ? 'tw-opacity-0 md:tw-opacity-100' : 'tw-opacity-100'}`}>
             <div className="tw-container tw-mx-auto tw-px-4 tw-mb-2">
                <h2 className="tw-text-2xl tw-font-bold tw-text-center md:tw-text-left tw-mb-2 tw-text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    我的作品
                </h2>
                <div className="tw-h-1 tw-w-16 tw-bg-blue-500 tw-mx-auto md:tw-mx-0"></div>
             </div>
            <ProjectTicker />
        </div>

        {/* 转场动画层 (PC & Mobile) */}
        <div 
            className={`tw-fixed tw-inset-0 tw-z-[300] tw-bg-black tw-flex tw-items-center tw-justify-center tw-pointer-events-none tw-transition-opacity tw-duration-1000 md:tw-hidden ${isClicked ? 'tw-opacity-100' : 'tw-opacity-0'}`} 
            style={{ transitionDelay: isClicked ? '4000ms' : '0ms' }}
        >
            <div className="tw-text-center">
                <h2 className="tw-text-white tw-text-2xl tw-font-bold tw-tracking-[0.5em] tw-animate-pulse tw-mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    SYSTEM LAUNCHING
                </h2>
                <div className="tw-w-32 tw-h-1 tw-bg-blue-500 tw-mx-auto tw-rounded-full tw-animate-pulse"></div>
            </div>
        </div>
    </div>
  );
};

export default Hero;
