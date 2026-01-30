import React, { useState, useRef } from "react";
import ProjectTicker from "../ProjectTicker";
import blogPosts from "@site/src/data/blogPosts.json";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { motion } from "framer-motion";
import { Dice5, Sparkles, Play, Pause } from "lucide-react";
import { useHistory } from "@docusaurus/router";

const DanmakuItem: React.FC<{ post: any; top: any; duration: any; delay: any }> = ({ post, top, duration, delay }) => {
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
};

const Hero = () => {
  const history = useHistory();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Background Assets
  const pcBgUrl = useBaseUrl("/img/pc-bg.png");
  const mobileBgUrl = useBaseUrl("/img/mobile-bg.mp4");
  
  // Mobile Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleRandomRead = () => {
    if (!blogPosts || blogPosts.length === 0) return;
    
    setIsClicked(true);
    
    const isMobile = window.innerWidth < 768;

    if (isMobile && videoRef.current) {
      // Play video for 5 seconds on mobile
      videoRef.current.play();
      setIsPlaying(true);
      
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * blogPosts.length);
        const randomPost = blogPosts[randomIndex];
        history.push(randomPost.permalink);
      }, 5000);
    } else {
      // Standard delay for PC
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * blogPosts.length);
        const randomPost = blogPosts[randomIndex];
        history.push(randomPost.permalink);
      }, 500);
    }
  };

  // Generate Danmaku tracks
  const danmakuTracks = [15, 30, 45, 65, 80]; // Adjusted positions
  const danmakuItems = React.useMemo(() => (blogPosts || []).map((post, index) => {
      return {
          post,
          track: index % danmakuTracks.length,
          duration: 20 + Math.random() * 10, 
          delay: index * 3 
      };
  }), []);

  return (
    <div className="tw-relative tw-min-h-screen tw-bg-gray-50 dark:tw-bg-black tw-text-gray-900 dark:tw-text-white tw-overflow-hidden tw-flex tw-flex-col tw--mt-[60px]">
        {/* Background Layer */}
        <div className="tw-absolute tw-inset-0 tw-z-0 tw-overflow-hidden">
            {/* Mobile Background (Video) - Default Paused */}
            <div className="tw-block md:tw-hidden tw-relative tw-w-full tw-h-full">
                <video
                    ref={videoRef}
                    loop
                    muted
                    playsInline
                    className="tw-w-full tw-h-full tw-object-cover"
                >
                    <source src={mobileBgUrl} type="video/mp4" />
                </video>
                {/* Mobile Play/Pause Control */}
                <button
                    onClick={togglePlay}
                    className={`tw-absolute tw-bottom-24 tw-right-6 tw-z-20 tw-p-3 tw-bg-black/30 hover:tw-bg-black/50 tw-rounded-full tw-text-white/80 hover:tw-text-white tw-backdrop-blur-sm tw-transition-all tw-duration-300 ${isClicked ? 'tw-opacity-0' : 'tw-opacity-100'}`}
                    aria-label={isPlaying ? "Pause background" : "Play background"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
            </div>

            {/* PC Background (Image) */}
            <div className="tw-hidden md:tw-block tw-w-full tw-h-full">
                <img 
                    src={pcBgUrl} 
                    alt="Background" 
                    className="tw-w-full tw-h-full tw-object-cover"
                />
            </div>
        </div>

        {/* Danmaku Layer */}
        <div className={`tw-absolute tw-inset-0 tw-z-10 tw-overflow-hidden tw-pointer-events-none tw-transition-opacity tw-duration-1000 ${isClicked && window.innerWidth < 768 ? 'tw-opacity-0' : 'tw-opacity-100'}`}>
            <div className="tw-relative tw-w-full tw-h-full tw-pointer-events-auto">
                {danmakuItems.map((item, index) => (
                    <DanmakuItem 
                        key={index}
                        post={item.post}
                        top={`${danmakuTracks[item.track]}%`}
                        duration={item.duration}
                        delay={item.delay}
                    />
                ))}
            </div>
        </div>

        {/* Main Content Area (Centered) */}
        <div className={`tw-relative tw-z-20 tw-container tw-mx-auto tw-px-4 tw-pt-20 tw-pb-12 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center text-center tw-transition-opacity tw-duration-1000 ${isClicked && window.innerWidth < 768 ? 'tw-opacity-0' : 'tw-opacity-100'}`}>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 className="tw-text-center tw-space-y-6"
            >
                <h1 
                    className="tw-text-5xl md:tw-text-7xl tw-font-bold tw-mb-4 tw-text-white dark:tw-text-white tw-tracking-wider tw-animate-pulse"
                    style={{ fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 20px rgba(0,0,0,0.5)" }}
                >
                    探索与创造
                </h1>
                <p 
                    className="tw-text-xl tw-text-gray-200 dark:tw-text-gray-300 tw-max-w-2xl tw-mx-auto tw-leading-relaxed tw-animate-pulse"
                    style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px", animationDuration: "3s" }}
                >
                    这里是我的数字花园，记录技术折腾、设计思考与生活随笔。
                    <br/>
                    保持好奇，持续构建。
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="tw-pt-4"
                >
                    <button
                        onClick={handleRandomRead}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        disabled={isClicked}
                        className={`tw-group tw-relative tw-inline-flex tw-items-center tw-gap-3 tw-px-8 tw-py-4 tw-bg-white/10 tw-backdrop-blur-md tw-border tw-text-white tw-rounded-full tw-font-bold tw-text-lg tw-shadow-xl hover:tw-shadow-2xl hover:tw-bg-white/20 hover:tw-border-white/50 tw-transition-all tw-duration-300 tw-overflow-hidden ${isClicked ? 'tw-border-t-transparent tw-border-l-transparent tw-border-r-white/50 tw-border-b-white/50 tw-animate-spin' : 'tw-border-white/30'}`}
                        style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "2px", animationDuration: isClicked ? "1s" : "0s" }}
                    >
                        {/* Animated Background Gradient - Removed on Click */}
                        {!isClicked && (
                            <div className={`tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-blue-600 tw-via-purple-600 tw-to-pink-600 tw-transition-opacity tw-duration-500 ${isHovering ? 'tw-opacity-100' : 'tw-opacity-0'}`} />
                        )}
                        
                        <span className={`tw-relative tw-z-10 tw-flex tw-items-center tw-gap-2 ${isClicked ? 'tw-opacity-0' : 'tw-opacity-100'}`}>
                            <motion.div
                                animate={isHovering ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 0.4 }}
                                className="tw-hidden md:tw-block"
                            >
                                <Dice5 className="tw-w-6 tw-h-6" />
                            </motion.div>
                            随机阅读
                            <Sparkles className="tw-w-5 tw-h-5 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-hidden md:tw-block" />
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </div>

        {/* Project Ticker Section */}
        <div className={`tw-relative tw-z-20 tw-mt-auto tw-pb-12 tw-transition-opacity tw-duration-1000 ${isClicked && window.innerWidth < 768 ? 'tw-opacity-0' : 'tw-opacity-100'}`}>
             <div className="tw-container tw-mx-auto tw-px-4 tw-mb-8">
                <h2 className="tw-text-2xl tw-font-bold tw-text-center md:tw-text-left tw-mb-2 tw-text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    精选作品
                </h2>
                <div className="tw-h-1 tw-w-16 tw-bg-blue-500 tw-mx-auto md:tw-mx-0"></div>
             </div>
            <ProjectTicker />
        </div>

        {/* Transition Overlay - Mobile Only */}
        <div 
            className={`md:tw-hidden tw-fixed tw-inset-0 tw-z-[300] tw-bg-black tw-flex tw-items-center tw-justify-center tw-pointer-events-none tw-transition-opacity tw-duration-1000 ${isClicked ? 'tw-opacity-100' : 'tw-opacity-0'}`} 
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
