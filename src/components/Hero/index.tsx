import React, { useState, useRef, useEffect } from "react";
import ProjectTicker from "../ProjectTicker";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const Hero = () => {
    // 背景资源
    const pcBgUrl = useBaseUrl("/img/pc-bg-optimized.mp4");
    const mobileBgUrl = useBaseUrl("/img/mobile-bg-optimized.mp4");
    const logoUrl = useBaseUrl("/svg/logo.svg");

    // 移动端视频控制状态
    const videoRef = useRef<HTMLVideoElement>(null);
    const pcVideoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const updateViewport = () => setIsDesktop(mediaQuery.matches);

        updateViewport();
        mediaQuery.addEventListener('change', updateViewport);
        return () => mediaQuery.removeEventListener('change', updateViewport);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setIsVideoReady(true);
            return;
        }

        const timer = window.setTimeout(() => setShouldLoadVideo(true), 800);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!shouldLoadVideo) return;

        const activeVideo = isDesktop ? pcVideoRef.current : videoRef.current;
        if (!activeVideo) return;

        activeVideo.load();
        void activeVideo.play();
    }, [isDesktop, shouldLoadVideo]);

    useEffect(() => {
        if (shouldLoadVideo) {
            setIsVideoReady(false);
        }
    }, [isDesktop, shouldLoadVideo]);

    // 切换视频播放状态
    const togglePlay = () => {
        if (!shouldLoadVideo) {
            setShouldLoadVideo(true);
            setIsPlaying(true);
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            void video.play();
        } else {
            video.pause();
        }
    };

    return (
        <div className="tw-relative tw-h-[100svh] md:tw-h-[100vh] tw-bg-gray-50 dark:tw-bg-black tw-text-gray-900 dark:tw-text-white tw-overflow-hidden tw-flex tw-flex-col tw--mt-[60px] tw-pt-[60px]">
            {/* 背景层 */}
            <div className="tw-absolute tw-inset-0 tw-z-0 tw-overflow-hidden">
                {/* 移动端背景 (视频) */}
                <div className="tw-block md:tw-hidden tw-relative tw-w-full tw-h-full">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        preload={shouldLoadVideo ? "metadata" : "none"}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onCanPlay={() => setIsVideoReady(true)}
                        onError={() => setIsVideoReady(true)}
                        className="tw-w-full tw-h-full tw-object-cover"
                    >
                        {!isDesktop && shouldLoadVideo && <source src={mobileBgUrl} type="video/mp4" />}
                    </video>
                    {/* 移动端播放/暂停控制按钮 */}
                    <button
                        onClick={togglePlay}
                        className="tw-absolute tw-bottom-24 tw-right-6 tw-z-20 tw-p-3 tw-bg-black/30 hover:tw-bg-black/50 tw-rounded-full tw-text-white/80 hover:tw-text-white tw-backdrop-blur-sm tw-transition-all tw-duration-300"
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
                        preload={shouldLoadVideo ? "metadata" : "none"}
                        onCanPlay={() => setIsVideoReady(true)}
                        onError={() => setIsVideoReady(true)}
                        className="tw-w-full tw-h-full tw-object-cover tw-absolute tw-inset-0"
                    >
                        {isDesktop && shouldLoadVideo && <source src={pcBgUrl} type="video/mp4" />}
                    </video>
                </div>

                <div className={`hero-video-loader ${isVideoReady ? 'hero-video-loader--hidden' : ''}`} aria-hidden="true">
                    <div className="hero-video-loader__mark">
                        <img src={logoUrl} alt="" />
                    </div>
                    <div className="hero-video-loader__pulse" />
                </div>
            </div>

            {/* 主要内容区域 (居中) */}
            <div className="tw-relative tw-z-20 tw-container tw-mx-auto tw-px-4 tw-flex-1 tw-w-full tw-h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="tw-absolute tw-top-[25%] md:tw-top-[20%] tw-left-0 tw-w-full tw-flex tw-flex-col tw-items-center tw-z-20"
                >
                    <div className="tw-h-[220px] md:tw-h-[300px] md:[@media(max-height:800px)]:tw-h-[230px] tw-w-full tw-max-w-5xl tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
                        <div className="hero-now-module" aria-label="时间易逝，感受当下。">
                            <div className="hero-now-axis" aria-hidden="true">
                                <span className="hero-now-axis__past">PAST</span>
                                <i></i>
                                <span className="hero-now-axis__now">NOW</span>
                                <i></i>
                                <span className="hero-now-axis__next">NEXT</span>
                            </div>
                            <div className="hero-now-dot" aria-hidden="true" />
                            <h1 className="hero-now-title">
                                时间易逝，感受<span>当下</span>
                            </h1>
                            <div className="hero-now-flow" aria-hidden="true">
                                <i></i>
                                <b></b>
                                <i></i>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 精选作品区域 */}
            <div className="tw-relative tw-z-20 tw-mt-auto tw-shrink-0">
                <div className="tw-container tw-mx-auto tw-px-4 tw-mb-2">
                    <h2 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-center md:tw-text-left tw-mb-2 tw-text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        我的作品
                    </h2>
                    <div className="tw-h-1 tw-w-16 tw-bg-blue-500 tw-mx-auto md:tw-mx-0"></div>
                </div>
                <ProjectTicker />
            </div>
        </div>
    );
};

export default Hero;
