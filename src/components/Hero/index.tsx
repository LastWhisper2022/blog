import React from "react";
import { motion } from "framer-motion";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

const Hero = () => {
  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-max-w-6xl tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between tw-gap-10">
        {/* 文字区域 - 左侧（PC） / 上方（Mobile） */}
        <motion.div
          className="tw-flex-1 tw-text-center md:tw-text-left tw-relative tw-z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1
            className="tw-text-4xl md:tw-text-5xl lg:tw-text-6xl tw-font-bold tw-text-gray-800 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            欢迎来到我的博客
          </motion.h1>
          <motion.p
            className="tw-text-lg md:tw-text-xl tw-text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            记录、学习和成长。
          </motion.p>

          <motion.div>
            <Link
              to="/blog" 
              className="tw-inline-block tw-px-6 tw-py-3 tw-bg-gray-100 tw-text-gray-800 tw-font-medium tw-rounded-lg tw-border tw-border-gray-200 tw-transition-all tw-duration-300"
            >
              开始阅读
            </Link>
          </motion.div>
        </motion.div>

        {/* 装饰 SVG - 右侧（PC） / 下方（Mobile） */}
        <motion.div
          className="tw-flex-1 tw-flex tw-justify-center tw-relative tw-z-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src={useBaseUrl("/svg/halloween-skeleton-03.svg")}
            alt="decoration"
            className="tw-w-64 tw-h-auto md:tw-w-80 lg:tw-w-96 tw-pointer-events-none "
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
