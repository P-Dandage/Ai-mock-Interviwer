"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Feature.css";

const features = [
  {
    title: "Ultimate Interview Mastery",
    desc: "Take unlimited AI mock interviews tailored to your dream job, covering multiple interview rounds with personalized feedback.",
    img: "card1.webp",
  },
  {
    title: "Job Description-Based Interviews",
    desc: "Practice based on the job description for any role in the company to improve your skills in articulation, communication, and domain.",
    img: "card2.webp",
  },
  {
    title: "Actionable Analytics",
    desc: "In-depth analytics that evaluate multiple factors, providing comprehensive insights into your interview performance, helping you improve across key areas.",
    img: "card3.webp",
  },
  {
    title: "Practice without the Pressure",
    desc: "Build your interview skills in a judgment-free zone. Answer practice questions and refine your delivery at your own pace.",
    img: "card4.jpeg",
  },
  {
    title: "Customize Mock Interviews",
    desc: "Specify your job title, paste the job description, and choose the interview type — Behavioral, Technical, Leadership, or HR.",
    img: "card1.webp",
  },
];

const Feature = () => {
  return (
    <div className="Feature">
      <h1>Features That Work <br /> For Your Future</h1>
      <p>
        Check out our amazing features and experience the <br />
        power of IntraAi for yourself.
      </p>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{ clickable: true }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="feature-slider"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <img src={feature.img} alt="Feature" className="feature-image" />
              <h3>{feature.title}</h3>
              <h5>{feature.desc}</h5>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Feature;
