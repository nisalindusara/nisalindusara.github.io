"use client";

import { motion, type Variants } from "framer-motion";
import { contactLinks, contactSection, profile } from "@/content/profile";
import { EASE_OUT } from "@/components/ui/motion";
import { Arrow } from "@/components/ui/Arrow";
import styles from "./Contact.module.css";

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const line: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Screen-reader name: says where the link goes. */
function ariaLabel(link: (typeof contactLinks)[number]) {
  if (link.href.startsWith("mailto:")) return `${link.label}, ${profile.email}`;
  return link.external ? `${link.label}, opens in a new tab` : link.label;
}

/** The /contact page content: label and the big stacked links. */
export function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-label">
      <div className={`container ${styles.inner}`}>
        <h1 id="contact-label" className={styles.label}>
          {contactSection.label}
        </h1>

        <motion.ul
          className={styles.list}
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {contactLinks.map((link) => (
            <li key={link.label} className={styles.mask}>
              <motion.a
                data-reveal
                href={link.href}
                className={styles.link}
                variants={line}
                aria-label={ariaLabel(link)}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
                <Arrow className={styles.arrow} />
              </motion.a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
