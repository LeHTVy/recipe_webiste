import React from "react";
import ProfileCard from "../../blocks/Components/ProfileCard/ProfileCard";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import AnimatedSection from "../../components/AnimatedSection/AnimatedSection";
import TrueFocus from "../../blocks/TextAnimations/TrueFocus/TrueFocus";
import Carousel from "../../blocks/Components/Carousel/Carousel";
import {
  fadeInLeft,
  fadeInRight,
  staggerContainer,
} from "../../hooks/useScrollAnimation";
import { FaChalkboardTeacher, FaBook, FaLaptopCode } from 'react-icons/fa';
import styles from "./AboutUs.module.css";
import Member1 from "../../assets/images/vy.jpg";
import Member2 from "../../assets/images/vinh.jpg";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Le Hoang Thao Vy",
      title: "22118775",
      handle: "vy",
      status: "Online",
      contactText: "HoaSen University",
      avatarUrl: Member1,
      onContactClick: () => console.log("Contact Vy clicked"),
    },
    {
      name: "Huynh Quang Vinhn",
      title: "22122478",
      handle: "vinh",
      status: "Online",
      contactText: "HoaSen University",
      avatarUrl: Member2,
      onContactClick: () => console.log("Contact Vinh clicked"),
    },
  ];

  const courseAndTeacherInfo = [
    {
      title: "Front-End Development Course",
      description: "SW306DE01 - 0100",
      id: 1,
      icon: <FaLaptopCode className="h-[16px] w-[16px] text-white" />,
    },
    {
      title: "Professor",
      description: "Pham Hong Thanh ",
      id: 2,
      icon: <FaChalkboardTeacher className="h-[16px] w-[16px] text-white" />,
    },
    {
      title: "Hoasen University",
      description: "Thank you for providing us a chance to study this course",
      id: 3,
      icon: <FaBook className="h-[16px] w-[16px] text-white" />,
    },
  ];

  return (
    <PageWrapper className={styles.aboutUsContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            <TrueFocus
              sentence="About Our Team"
              manualMode={false}
              blurAmount={5}
              borderColor="#113e21"
              glowColor="rgba(17, 62, 33, 0.6)"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </div>
          <div className={styles.heroDescription}>
            <TrueFocus
              sentence="We are a passionate student team from HoaSen University"
              manualMode={false}
              blurAmount={3}
              borderColor="#00bf63"
              glowColor="rgba(0, 191, 99, 0.4)"
              animationDuration={1.5}
              pauseBetweenAnimations={0.2}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <AnimatedSection variant={fadeInLeft} delay={0.2}>
        <section className={styles.teamSection}>
           {/*<div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet Our Team</h2>
            <p className={styles.sectionDescription}>
              Get to know the talented individuals behind our success
            </p>
          </div>*/}

          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.cardWrapper}>
                <ProfileCard
                  name={member.name}
                  title={member.title}
                  handle={member.handle}
                  status={member.status}
                  contactText={member.contactText}
                  avatarUrl={member.avatarUrl}
                  showUserInfo={true}
                  enableTilt={true}
                  onContactClick={member.onContactClick}
                />
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Mission Section */}
      <AnimatedSection variant={fadeInRight} delay={0.4}>
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              To empower businesses and individuals through innovative
              technology solutions that simplify complex problems and enhance
              user experiences. We believe in the power of collaboration,
              creativity, and continuous learning to drive meaningful change in
              the digital world.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Course and Teacher Information Carousel */}
      <AnimatedSection variant={fadeInLeft} delay={0.6}>
        <section className={styles.carouselSection}>
          <div className={styles.carouselContent}>
            <h2 className={styles.carouselTitle}>Course's Information</h2>
            <div className={styles.carouselWrapper}>
              <Carousel 
                items={courseAndTeacherInfo}
                baseWidth={400} 
                autoplay={true} 
                autoplayDelay={3000} 
                pauseOnHover={true} 
                loop={true} 
                round={false} 
              />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection variant={staggerContainer} delay={0.8}>
        <section className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🚀</div>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueDescription}>
                We constantly push boundaries and explore new technologies to
                deliver cutting-edge solutions.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>Collaboration</h3>
              <p className={styles.valueDescription}>
                We believe in the power of teamwork and open communication to
                achieve extraordinary results.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3 className={styles.valueTitle}>Excellence</h3>
              <p className={styles.valueDescription}>
                We strive for perfection in everything we do, from code quality
                to user experience.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌱</div>
              <h3 className={styles.valueTitle}>Growth</h3>
              <p className={styles.valueDescription}>
                We embrace continuous learning and personal development to stay
                ahead of the curve.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  );
};

export default AboutUs;
