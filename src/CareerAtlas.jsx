import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Compass, GraduationCap, Briefcase, Palette, Sparkles, Search,
  FlaskConical, CalendarDays, Info, ChevronDown, ExternalLink,
  Check, X, Sun, Moon, MapPin, Wallet, ListChecks, HelpCircle,
  ShieldAlert, Landmark, Gem, Wrench, BookOpen, HeartHandshake,
  Star, Phone, AlertTriangle, FileText, Wind, Scale, Copy, RotateCcw, ArrowUp, Menu,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

/* ────────────────────────────────────────────────────────────
   DESIGN TOKENS — claymorphism
   Soft pastel gradient world, puffy raised shapes, dual-tone
   shadows. Signature: hero "clay path" — a tactile 3D route
   from "You" to each stream, and a floating starred-exam tray.
──────────────────────────────────────────────────────────── */

const STREAM_META = {
  all:      { label: "All Streams",  icon: Compass,      chip: "#f6dfa8", text: "#4a3418" },
  science:  { label: "Science",      icon: FlaskConical, chip: "#bcd6f2", text: "#1c3252" },
  commerce: { label: "Commerce",     icon: Briefcase,     chip: "#bfe0c4", text: "#1d3a22" },
  arts:     { label: "Arts & Humanities", icon: Palette,  chip: "#f0c3cf", text: "#5a1f2c" },
};

const EXAMS = [
  { name: "JEE Main", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "NITs, IIITs, GFTIs — B.Tech", difficulty: "Hard", fees: "₹6–10L (4yr)", salary: "₹8–20 LPA", tag: "🔥", month: "Jan 2027", when: "Jan + Apr", fmtMode: "CBT · 3 hrs", fmtQs: "75 Qs · +4/−1", cutoff: "~93–97 percentile for a decent NIT branch", fmtExtra: "None for B.Tech — pure PCM", link: "jeemain.nta.nic.in", colleges: "NIT Trichy, NIT Warangal, IIIT Hyderabad" },
  { name: "NEET UG", stream: "science", subj: "PCB", reqMaths: false, reqBio: true, gets: "MBBS, BDS, AYUSH", difficulty: "Very Hard", fees: "₹6–10L (5.5yr)", salary: "₹8–20+ LPA", tag: "🔥", month: "May 2027", when: "May", fmtMode: "CBT (new, 2027) · 3 hrs", fmtQs: "180 Qs · +4/−1", cutoff: "AIR under 50,000 for a govt MBBS seat", fmtExtra: "None — pure PCB", link: "neet.nta.nic.in", colleges: "AIIMS, Govt Medical Colleges, AFMC" },
  { name: "IAT (IISER)", stream: "science", subj: "PCMB", reqMaths: true, reqBio: true, gets: "IISERs, NISER route — B.S.", difficulty: "Hard", fees: "₹4–6L (5yr)", salary: "₹8–15 LPA", tag: "⭐", month: "Jun 2027", when: "June", fmtMode: "CBT · 3 hrs", fmtQs: "60 Qs · +4/−1 (max 240)", cutoff: "Top ~3,000 rank", fmtExtra: "Biology compulsory alongside PCM — attempt all 4 sections", link: "iiseradmission.in", colleges: "IISER Pune, Kolkata, Bhopal, Mohali" },
  { name: "NEST", stream: "science", subj: "PCMB", reqMaths: true, reqBio: true, gets: "NISER, CEBS — Integrated M.Sc.", difficulty: "Moderate", fees: "Stipend-paid", salary: "₹10–18 LPA", tag: "⭐", month: "Jun 2027", when: "June", fmtMode: "CBT · 3.5 hrs", fmtQs: "80 Qs · best 3 of 4 sections count", cutoff: "Top ~1,000 rank", fmtExtra: "A weak subject won't sink your score", link: "nestexam.in", colleges: "NISER Bhubaneswar, UM-DAE CEBS Mumbai" },
  { name: "WBJEE", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "WB state engg/pharmacy colleges", difficulty: "Moderate", fees: "₹1.5–3L (4yr)", salary: "₹5–12 LPA", tag: "", month: "Apr 2027", when: "April", fmtMode: "Offline · 4 hrs (2 papers)", fmtQs: "155 Qs · 3-tier marking", cutoff: "Rank under 5,000 for CSE at top colleges", fmtExtra: "Category III has zero negative marking", link: "wbjeeb.nic.in", colleges: "Jadavpur University, IIEST Shibpur" },
  { name: "BITSAT", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "BITS Pilani/Goa/Hyderabad", difficulty: "Hard", fees: "₹20L+ (4yr, private)", salary: "₹10–20 LPA", tag: "", month: "May 2027", when: "May–June", fmtMode: "CBT · 3 hrs", fmtQs: "130 Qs · +3/−1", cutoff: "320+/450 for Pilani campus CSE", fmtExtra: "Optional English + Logical Reasoning section", link: "bitsadmission.com", colleges: "BITS Pilani, Goa, Hyderabad" },
  { name: "IMU CET", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Merchant Navy — Marine Engg", difficulty: "Moderate", fees: "₹3–8L (4yr)", salary: "₹24–72 LPA (senior)", tag: "🔥", month: "May 2027", when: "May–June", fmtMode: "CBT · 3 hrs", fmtQs: "200 MCQs", cutoff: "Top ~500 rank", fmtExtra: "Dedicated English & General Aptitude section", link: "imu.edu.in", colleges: "IMU Chennai + 6 campuses" },
  { name: "NATA / JEE Paper 2", stream: "all", subj: "Any with Maths", reqMaths: true, reqBio: false, gets: "B.Arch — architecture colleges", difficulty: "Moderate", fees: "₹2–5L (5yr)", salary: "₹6–12 LPA", tag: "", month: "Apr 2027", when: "Apr–Jul", fmtMode: "CBT + offline Drawing Test", fmtQs: "Aptitude MCQs + 2 drawing Qs", cutoff: "80+/200 for a decent B.Arch seat", fmtExtra: "Hand-drawn spatial test — open to all streams with Maths; Science students can also use JEE Main Paper 2", link: "nata.in", colleges: "SPA Delhi, govt architecture colleges" },
  { name: "UCEED", stream: "science", subj: "Any", reqMaths: false, reqBio: false, gets: "B.Des at IITs, IIITDM", difficulty: "Hard", fees: "₹8–10L (4yr)", salary: "₹8–15 LPA", tag: "⭐", month: "Jan 2027", when: "January", fmtMode: "Part A CBT + Part B pen&paper", fmtQs: "MCQ/NAT + design tasks", cutoff: "Rank under 100 for IIT Bombay design", fmtExtra: "Zero PCMB content — pure visual/spatial reasoning", link: "uceed.iitb.ac.in", colleges: "IIT Bombay, Guwahati, Delhi" },
  { name: "NCHM JEE", stream: "science", subj: "Any", reqMaths: false, reqBio: false, gets: "Central Hotel Mgmt Institutes", difficulty: "Easy-Mod", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "", month: "Apr 2027", when: "Apr–May", fmtMode: "CBT · 3 hrs", fmtQs: "200 Qs across 5 sections", cutoff: "Rank under 3,000", fmtExtra: "Numerical, Reasoning, GK, English, Service Aptitude", link: "nchmjee.nta.nic.in", colleges: "21 Central IHMs" },
  { name: "ICAR AIEEA", stream: "science", subj: "PCB/PCM", reqMaths: false, reqBio: false, gets: "BSc Agriculture (govt)", difficulty: "Moderate", fees: "₹20K–60K/yr", salary: "₹4–10 LPA", tag: "", month: "May 2027", when: "May–June", fmtMode: "CBT · 3 hrs", fmtQs: "150 Qs · +4/−1", cutoff: "Top ~5,000 rank", fmtExtra: "None beyond PCB/PCM — one of the lightest-prep exams here", link: "icar.nta.nic.in", colleges: "IARI Delhi, State Agri Universities" },
  { name: "NDA", stream: "all", subj: "Any (Army) / PCM (Navy-AF)", reqMaths: false, reqBio: false, gets: "Army / Navy / Air Force officer", difficulty: "Moderate", fees: "Free training + stipend", salary: "₹8–20 LPA equiv.", tag: "", month: "Apr 2027", when: "Apr + Sep", fmtMode: "Offline · 5 hrs (2 papers)", fmtQs: "Maths 120 + GAT 150 Qs", cutoff: "Top ~2,000 written, then SSB clearance", fmtExtra: "English + GK section, then SSB interview", link: "upsc.gov.in", colleges: "NDA Khadakwasla" },
  { name: "CA Foundation", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "Chartered Accountancy (ICAI)", difficulty: "Hard", fees: "Very low", salary: "₹6–10 LPA", tag: "⭐", month: "Jan 2027", when: "Jan/May/Sept", fmtMode: "Offline · 4 papers", fmtQs: "400 marks total", cutoff: "~40–50% pass rate, no rank system", fmtExtra: "Papers 3–4 objective, −0.25 wrong", link: "icai.org", colleges: "ICAI — nationwide, no campus needed" },
  { name: "CSEET", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "Company Secretary (ICSI)", difficulty: "Moderate", fees: "Low", salary: "₹5–9 LPA", tag: "", month: "Mar 2027", when: "Multiple sessions", fmtMode: "CBT, remote proctored", fmtQs: "4 sections incl. Legal Aptitude", cutoff: "~50% qualifying score, no rank", fmtExtra: "Business Comm + Legal Aptitude — new territory", link: "icsi.edu", colleges: "ICSI — nationwide" },
  { name: "CMA Foundation", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "Cost & Mgmt Accountancy", difficulty: "Moderate", fees: "Low", salary: "₹5–9 LPA", tag: "", month: "Jun 2027", when: "June + Dec", fmtMode: "Offline · 4 papers", fmtQs: "50 Qs/paper, 2 marks each", cutoff: "40% aggregate, no rank system", fmtExtra: "Fully objective, unlike CA Foundation's mixed format", link: "icmai.in", colleges: "ICMAI — nationwide" },
  { name: "IPMAT", stream: "commerce", subj: "Maths", reqMaths: true, reqBio: false, gets: "IIM Indore/Rohtak — Integrated BBA+MBA", difficulty: "Hard", fees: "₹8–12L (5yr)", salary: "₹15–30 LPA", tag: "🔥", month: "May 2027", when: "May", fmtMode: "CBT · ~2 hrs", fmtQs: "Quant + Verbal (MCQ + short answer)", cutoff: "Top ~100 rank for IIM Indore", fmtExtra: "Non-MCQ Maths section — genuinely unusual", link: "iimidr.ac.in", colleges: "IIM Indore, IIM Rohtak" },
  { name: "NPAT / SET", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "NMIMS / Symbiosis BBA, B.Com", difficulty: "Moderate", fees: "₹8–15L (3yr)", salary: "₹5–10 LPA", tag: "", month: "Mar 2027", when: "Varies", fmtMode: "CBT · ~100 min", fmtQs: "MCQ across Quant, Reasoning, English", cutoff: "Top ~1,000 percentile rank", fmtExtra: "None beyond standard aptitude", link: "nmims.edu", colleges: "NMIMS, Symbiosis" },
  { name: "CLAT", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "22 NLUs — BA LLB", difficulty: "Hard", fees: "₹10–18L (5yr)", salary: "₹8–20 LPA", tag: "🔥", month: "Dec 2026", when: "December", fmtMode: "Offline · 2 hrs", fmtQs: "120 Qs · +1/−0.25", cutoff: "Rank under 500 for a top-5 NLU", fmtExtra: "Legal reasoning — new territory", link: "consortiumofnlus.ac.in", colleges: "NLSIU Bangalore, NALSAR Hyderabad" },
  { name: "AILET", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "NLU Delhi's own test — BA LLB", difficulty: "Hard", fees: "₹8–12L (5yr)", salary: "₹8–20 LPA", tag: "", month: "Dec 2026", when: "December", fmtMode: "Offline · MCQ", fmtQs: "~150 Qs, similar to CLAT", cutoff: "Rank under 100 for NLU Delhi", fmtExtra: "NLU Delhi's own paper — separate from CLAT", link: "nludelhi.ac.in", colleges: "National Law University, Delhi" },
  { name: "NID DAT", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Product / Communication Design", difficulty: "Hard", fees: "Moderate", salary: "₹6–14 LPA", tag: "⭐", month: "Dec 2026", when: "Dec–Jan", fmtMode: "Offline · 3 hrs", fmtQs: "Prelims + Studio Test", cutoff: "Rank under 200", fmtExtra: "Pure drawing/creative aptitude", link: "nid.edu", colleges: "NID Ahmedabad, Bengaluru, Gandhinagar" },
  { name: "NIFT Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Fashion / Textile / Accessory Design", difficulty: "Hard", fees: "Moderate", salary: "₹5–12 LPA", tag: "", month: "Jan 2027", when: "Jan–Feb", fmtMode: "CAT (MCQ) + Situation Test", fmtQs: "GAT for Fashion Mgmt track", cutoff: "Rank under 500", fmtExtra: "Creative Ability Test — sketching & design sense", link: "nift.ac.in", colleges: "NIFT Delhi, Mumbai + 14 more campuses" },
  { name: "TISS-BAT", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Social Sciences, Dev. Studies", difficulty: "Moderate", fees: "Low", salary: "₹4–9 LPA", tag: "⭐", month: "May 2027", when: "Around May", fmtMode: "CBT · around 2 hrs", fmtQs: "MCQ, GK + reasoning + English", cutoff: "Top ~300 rank", fmtExtra: "No PCMB/Commerce content — pure aptitude", link: "tiss.edu", colleges: "TISS Mumbai, Hyderabad, Guwahati" },
  { name: "IIMC / Jamia MassComm", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Journalism & Mass Comm", difficulty: "Moderate", fees: "Low (govt)", salary: "₹4–10 LPA", tag: "", month: "Jun 2027", when: "Varies", fmtMode: "Offline · written + interview", fmtQs: "English + GK + current affairs heavy", cutoff: "Top ~100 — very limited seats", fmtExtra: "Strong current-affairs habit matters more than any textbook", link: "iimc.gov.in", colleges: "IIMC Delhi + regional campuses" },
  { name: "CUET UG", stream: "all", subj: "Any", reqMaths: false, reqBio: false, gets: "250+ universities, any domain", difficulty: "Easy-Mod", fees: "₹5K–90K/yr", salary: "₹4–10 LPA", tag: "🛟", month: "May 2027", when: "May–June", fmtMode: "CBT · ~60 min/paper", fmtQs: "50 Qs/paper · +5/−1", cutoff: "80+ percentile for top DU colleges", fmtExtra: "Pick your stream's domain subjects + General Test. One score unlocks DU, BHU, JNU, AMU and 250+ more — the single highest-leverage exam for Commerce and Arts students", link: "cuet.nta.nic.in", colleges: "DU, BHU, JNU, AMU + 250 more" },
  { name: "MHT-CET", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Maharashtra state engg/pharmacy colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "Apr 2027", when: "Apr–May", fmtMode: "Mostly CBT, some offline", fmtQs: "~150 Qs, state-specific marking", cutoff: "Percentile 95+ for a strong branch", fmtExtra: "No extra subject — pure PCM/PCB, home-state quotas apply", link: "cetcell.mahacet.org", colleges: "COEP Pune, VJTI Mumbai" },
  { name: "KCET", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Karnataka state engg/medical colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "Apr 2027", when: "Apr–May", fmtMode: "Mostly CBT, some offline", fmtQs: "~150 Qs, state-specific marking", cutoff: "Rank under 5,000", fmtExtra: "No extra subject — pure PCM/PCB, home-state quotas apply", link: "kea.kar.nic.in", colleges: "UVCE, state engg colleges" },
  { name: "KEAM", stream: "science", subj: "PCM/PCB", reqMaths: false, reqBio: false, gets: "Kerala state engg/medical colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "Apr 2027", when: "Apr–May", fmtMode: "Mostly CBT, some offline", fmtQs: "~150 Qs, state-specific marking", cutoff: "Rank under 3,000", fmtExtra: "No extra subject — pure PCM/PCB, home-state quotas apply", link: "cee.kerala.gov.in", colleges: "College of Engineering Trivandrum" },
  { name: "TS/AP EAMCET", stream: "science", subj: "PCM/PCB", reqMaths: false, reqBio: false, gets: "Telangana/Andhra state colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "May 2027", when: "May", fmtMode: "Mostly CBT, some offline", fmtQs: "~150 Qs, state-specific marking", cutoff: "Rank under 5,000", fmtExtra: "No extra subject — pure PCM/PCB, home-state quotas apply", link: "eamcet.tsche.ac.in", colleges: "JNTU Hyderabad, Osmania" },
  { name: "COMEDK UGET", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Karnataka private engg colleges", difficulty: "Moderate", fees: "₹3–6L (4yr)", salary: "₹5–10 LPA", tag: "", month: "May 2027", when: "May", fmtMode: "Mostly CBT, some offline", fmtQs: "~150 Qs, state-specific marking", cutoff: "Rank under 3,000", fmtExtra: "No extra subject — pure PCM/PCB, home-state quotas apply", link: "comedk.org", colleges: "RV College, PES University" },
  { name: "State Pharmacy CET", stream: "science", subj: "PCB/PCM", reqMaths: false, reqBio: false, gets: "Govt B.Pharm colleges", difficulty: "Easy", fees: "₹25K–80K/yr", salary: "₹3–8 LPA", tag: "", month: "May 2027", when: "State-wise", fmtMode: "Offline/CBT, state-run", fmtQs: "~100 Qs, state-specific", cutoff: "Rank under 10,000", fmtExtra: "None beyond PCB/PCM", link: "varies by state", colleges: "State govt pharmacy colleges" },
  { name: "ISI Admission Test", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "ISI Kolkata — B.Stat / B.Math (Hons)", difficulty: "Hard", fees: "Very low (govt)", salary: "₹10–20 LPA", tag: "⭐", month: "May 2027", when: "May", fmtMode: "Offline · UGA + UGB", fmtQs: "UGA 30 MCQs (screening) + UGB descriptive", cutoff: "Top ~100 — extremely limited seats", fmtExtra: "Descriptive Maths in UGB — deeper than JEE-style MCQs", link: "admission.isical.ac.in", colleges: "Indian Statistical Institute, Kolkata" },
  { name: "CMI Entrance", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Chennai Mathematical Institute — BSc Maths & CS", difficulty: "Hard", fees: "Low", salary: "₹10–18 LPA", tag: "⭐", month: "May 2027", when: "May", fmtMode: "Offline · MCQ + descriptive", fmtQs: "Varies by year", cutoff: "Top ~50 — extremely limited seats", fmtExtra: "Strong Olympiad rank can waive the written test", link: "cmi.ac.in", colleges: "Chennai Mathematical Institute" },
  { name: "AMU Engineering Entrance", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Aligarh Muslim University — B.Tech", difficulty: "Moderate", fees: "Low (central univ)", salary: "₹5–12 LPA", tag: "", month: "May 2027", when: "May", fmtMode: "Offline · MCQ (PCM-based)", fmtQs: "~100 Qs", cutoff: "Rank under 1,000", fmtExtra: "None beyond PCM", link: "amucontrollerexams.com", colleges: "Aligarh Muslim University" },
  { name: "AFMC (via NEET)", stream: "science", subj: "PCB", reqMaths: false, reqBio: true, gets: "Armed Forces Medical College — MBBS + officer commission", difficulty: "Very Hard", fees: "Heavily subsidised", salary: "₹8–20 LPA equiv.", tag: "⭐", month: "Jun 2027", when: "Apply post-NEET, ~June", fmtMode: "NEET score + separate application", fmtQs: "SSB-style interview + medical board", cutoff: "AIR under 2,000 + medical fitness", fmtExtra: "Officer commission on top of the MBBS — unique among NEET routes", link: "afmc.nic.in", colleges: "AFMC Pune" },
  { name: "JEXPO", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "WB Polytechnic Diploma → lateral entry to B.Tech 2nd yr", difficulty: "Easy", fees: "₹10K–30K/yr", salary: "₹3–7 LPA (pre-degree)", tag: "🛟", month: "Apr 2027", when: "April", fmtMode: "Offline · MCQ", fmtQs: "~100 Qs", cutoff: "Rank under 10,000", fmtExtra: "None beyond PCM — a genuine low-cost fallback route", link: "wbscte.co.in", colleges: "WB Govt Polytechnics" },
  { name: "VITEEE", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "VIT Vellore/Chennai/AP/Bhopal — B.Tech", difficulty: "Moderate", fees: "₹15–20L (4yr, private)", salary: "₹8–15 LPA", tag: "", month: "Apr 2027", when: "April", fmtMode: "CBT · 2.5 hrs", fmtQs: "125 Qs, no negative marking", cutoff: "Rank under 15,000", fmtExtra: "No negative marking — genuinely different from JEE's risk profile", link: "viteee.vit.ac.in", colleges: "VIT Vellore, VIT Chennai" },
  { name: "SRMJEEE", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "SRM Chennai/NCR/Sonipat — B.Tech", difficulty: "Moderate", fees: "₹15–20L (4yr, private)", salary: "₹6–12 LPA", tag: "", month: "Apr 2027", when: "Apr–May, multiple phases", fmtMode: "CBT · 2.5 hrs", fmtQs: "125 Qs · +1/0", cutoff: "Rank under 20,000", fmtExtra: "No negative marking, multiple attempt phases each year", link: "srmist.edu.in", colleges: "SRM Kattankulathur" },
  { name: "Manipal MET", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "MAHE Manipal — B.Tech, other programmes", difficulty: "Moderate", fees: "₹15–20L (4yr, private)", salary: "₹6–14 LPA", tag: "", month: "Apr 2027", when: "Apr–May", fmtMode: "CBT · 2 hrs 15 min", fmtQs: "200 Qs · +1/−0.25", cutoff: "Rank under 10,000", fmtExtra: "None beyond PCM", link: "manipal.edu", colleges: "MAHE Manipal" },
  { name: "ACET", stream: "commerce", subj: "Any", reqMaths: true, reqBio: false, gets: "Actuarial Science — Institute of Actuaries of India", difficulty: "Hard", fees: "Low, pay-per-exam", salary: "₹8–20 LPA (qualified)", tag: "⭐", month: "Jun 2027", when: "Multiple sessions", fmtMode: "CBT · 3 hrs", fmtQs: "~100 Qs across Maths/Stats/English/Logic", cutoff: "Pass with 50%+, no rank system", fmtExtra: "Maths-heavy — a strong fit if you kept Maths in Commerce", link: "actuariesindia.org", colleges: "No campus — exam-based professional qualification" },
  { name: "SSC CHSL", stream: "all", subj: "Any", reqMaths: false, reqBio: false, gets: "Govt clerical/assistant roles straight after 12th", difficulty: "Moderate", fees: "Free/nominal", salary: "₹3–6 LPA + govt benefits", tag: "🛟", month: "Aug 2027", when: "Annual, notification ~varies", fmtMode: "CBT, 2 tiers", fmtQs: "Tier 1: 100 Qs · Tier 2: descriptive", cutoff: "Top ~5,000 (all-India, category-dependent)", fmtExtra: "General Awareness + Quant + English + Reasoning", link: "ssc.nic.in", colleges: "Central govt offices nationwide" },
  { name: "FTII / SRFTI Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Film & Television direction, editing, cinematography", difficulty: "Hard", fees: "Low (govt institutes)", salary: "₹4–15 LPA (highly variable)", tag: "⭐", month: "Jun 2027", when: "Varies by course", fmtMode: "Written + interview/portfolio", fmtQs: "Course-specific creative & written test", cutoff: "Rank under 50 — extremely limited seats", fmtExtra: "Portfolio/creative submission matters as much as the written test", link: "ftii.ac.in", colleges: "FTII Pune, SRFTI Kolkata" },
  { name: "NSD Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "National School of Drama — acting, direction, design", difficulty: "Hard", fees: "Low (govt institute)", salary: "₹3–10 LPA (highly variable)", tag: "", month: "Jun 2027", when: "Annual", fmtMode: "Written + workshop + interview", fmtQs: "Multi-stage selection over several days", cutoff: "Rank under 30 — extremely limited seats", fmtExtra: "Workshop-based evaluation, not a single written paper", link: "nsd.gov.in", colleges: "National School of Drama, Delhi" },
  { name: "JEE Advanced", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "IITs — B.Tech, Dual Degree, B.Arch", difficulty: "Very Hard", fees: "₹6–10L (4yr)", salary: "₹12–35 LPA", tag: "🔥", month: "May 2027", when: "May (2nd Sunday)", fmtMode: "CBT · 3 hrs × 2 papers", fmtQs: "Paper 1 + 2 — MSQ, Numerical & MCQ mix", cutoff: "IIT seat needs AIR under ~5,000 CRL; top branches under 1,000", fmtExtra: "Only JEE Main top 2.5L qualifiers eligible — must qualify Main in the same year", link: "jeeadv.ac.in", colleges: "IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur" },
  { name: "TANCET", stream: "science", subj: "PCM/PCB", reqMaths: false, reqBio: false, gets: "Tamil Nadu state engg / pharmacy colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "May 2027", when: "May", fmtMode: "Offline · MCQ", fmtQs: "~100 Qs, state-specific marking", cutoff: "Rank under 5,000 for CSE at a good TN college", fmtExtra: "Pure PCM syllabus — home-state quota benefits TN students significantly", link: "annauniv.edu/tancet", colleges: "Anna University affiliated colleges, Tamil Nadu" },
  { name: "GUJCET", stream: "science", subj: "PCM/PCB", reqMaths: false, reqBio: false, gets: "Gujarat state engg / pharmacy colleges", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹4–9 LPA", tag: "🛟", month: "Mar 2027", when: "March", fmtMode: "Offline · MCQ", fmtQs: "~120 Qs (Physics + Chemistry + Maths/Bio)", cutoff: "Rank under 5,000 — used alongside JEE Main percentile", fmtExtra: "JEE Main score is also factored in — dual-use prep is efficient", link: "gseb.org", colleges: "LDCE Ahmedabad, Nirma University, state engg colleges" },
  { name: "OJEE", stream: "science", subj: "PCM/PCB", reqMaths: false, reqBio: false, gets: "Odisha state engg / pharmacy / lateral entry B.Tech", difficulty: "Moderate", fees: "₹1–2L (4yr)", salary: "₹4–8 LPA", tag: "🛟", month: "May 2027", when: "May", fmtMode: "CBT · MCQ", fmtQs: "~120 Qs (PCM)", cutoff: "Rank under 5,000 for a decent branch", fmtExtra: "Diploma holders can use the lateral-entry track — separate test within OJEE", link: "ojee.nic.in", colleges: "CET Bhubaneswar, ITER, state engg colleges" },
  { name: "CUSAT CAT", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Cochin University — B.Tech, BCA, 5yr LLB", difficulty: "Moderate", fees: "₹1–3L (4yr)", salary: "₹5–12 LPA", tag: "⭐", month: "Apr 2027", when: "April", fmtMode: "CBT · 2 hrs", fmtQs: "~150 Qs (PCM-based)", cutoff: "Rank under 2,000 for CSE", fmtExtra: "Central-govt-aided university fees — 20–30% of comparable private college cost", link: "cusat.ac.in", colleges: "Cochin University of Science and Technology, Kochi" },
  { name: "KIITEE", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "KIIT University Bhubaneswar — B.Tech", difficulty: "Moderate", fees: "₹14–18L (4yr, private)", salary: "₹6–12 LPA", tag: "", month: "Apr 2027", when: "Apr–May", fmtMode: "CBT · 3 hrs", fmtQs: "120 Qs · +4/−1", cutoff: "Rank under 10,000", fmtExtra: "Strong East India private placement; multiple test slots per cycle", link: "kiit.ac.in", colleges: "KIIT University, Bhubaneswar" },
  { name: "AEEE", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "Amrita Vishwa Vidyapeetham — B.Tech", difficulty: "Moderate", fees: "₹12–18L (4yr, private)", salary: "₹6–12 LPA", tag: "", month: "Apr 2027", when: "Apr–May", fmtMode: "CBT · 2.5 hrs", fmtQs: "100 Qs · +3/−1", cutoff: "Rank under 20,000", fmtExtra: "Multiple attempt slots each cycle — meaningfully improves your chances", link: "amrita.edu/admissions", colleges: "Amrita Coimbatore, Bengaluru, Kochi, Chennai" },
  { name: "PESSAT", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "PES University Bengaluru — B.Tech", difficulty: "Moderate", fees: "₹12–16L (4yr, private)", salary: "₹6–14 LPA", tag: "", month: "Apr 2027", when: "April–May", fmtMode: "CBT · 2 hrs", fmtQs: "180 Qs · +1/0", cutoff: "Rank under 5,000", fmtExtra: "Zero negative marking — a very different risk profile from JEE", link: "pes.edu", colleges: "PES University, Bengaluru" },
  { name: "JIPMAT", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "IIM Bodh Gaya / Jammu / Sirmaur — Integrated BBA+MBA", difficulty: "Moderate", fees: "₹5–9L (5yr)", salary: "₹12–22 LPA", tag: "⭐", month: "Jun 2027", when: "June", fmtMode: "CBT · 2.5 hrs", fmtQs: "100 Qs — Quant, Verbal, Data Interpretation", cutoff: "Top ~2,500 rank for any of the three newer IIMs", fmtExtra: "Less competitive than IPMAT Indore — same IIM pedigree, newer and smaller batch", link: "jipmat.nta.nic.in", colleges: "IIM Bodh Gaya, IIM Jammu, IIM Sirmaur" },
  { name: "GGSIPU CET BBA", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "IP University Delhi — BBA, B.Com (Hons)", difficulty: "Moderate", fees: "₹80K–2L (3yr)", salary: "₹5–10 LPA", tag: "", month: "May 2027", when: "May", fmtMode: "CBT · 2.5 hrs", fmtQs: "~150 Qs — Quant, English, GK, Logical Reasoning", cutoff: "Rank under 3,000 for BBA at a good IP University college", fmtExtra: "Low fees at a centralised Delhi university — easy to run alongside CUET prep", link: "ipu.ac.in", colleges: "VIPS Delhi, BVICAM, IP University constituent colleges" },
  { name: "UGAT", stream: "commerce", subj: "Any", reqMaths: false, reqBio: false, gets: "BBA / B.Com / BCA / Hotel Mgmt — 700+ AIMA colleges", difficulty: "Easy-Mod", fees: "₹2–8L (3yr)", salary: "₹4–8 LPA", tag: "", month: "May 2027", when: "May", fmtMode: "Offline MCQ · 2 hrs", fmtQs: "175 Qs — English, Maths, GK, Reasoning", cutoff: "No centralized cutoff — each college sets its own", fmtExtra: "One exam, 700+ AIMA-affiliated colleges — the widest safety-net for Commerce students", link: "aima.in/ugat", colleges: "700+ AIMA-affiliated colleges across India" },
  { name: "LSAT India", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "150+ private law schools — BA LLB, BBA LLB", difficulty: "Moderate", fees: "₹8–18L (5yr)", salary: "₹8–20 LPA", tag: "", month: "Jan 2027", when: "Jan + May", fmtMode: "CBT · 2 hrs 20 min", fmtQs: "92 Qs — Analytical Reasoning, Logical, Reading Comprehension", cutoff: "No centralized rank — each school sets its own score cutoff", fmtExtra: "Pure reasoning test, no subject knowledge tested — accepted by 150+ private law schools", link: "discoverlaw.in", colleges: "Jindal Global Law School, Symbiosis Law, Amity Law" },
  { name: "MHCET Law", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Maharashtra state law colleges — 5yr & 3yr LLB", difficulty: "Moderate", fees: "₹40K–2L (5yr, govt)", salary: "₹6–14 LPA", tag: "🛟", month: "Apr 2027", when: "April", fmtMode: "Offline · 2 hrs", fmtQs: "150 Qs — Legal Aptitude, GK, Maths, English, Logical", cutoff: "Rank under 2,000 for ILS Pune or Govt Law College Mumbai", fmtExtra: "MH state domicile quota is large — govt law colleges here have very low fees", link: "mahacet.org", colleges: "ILS Law College Pune, Govt Law College Mumbai" },
  { name: "TS/AP LAWCET", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Telangana/Andhra law colleges — 3yr & 5yr LLB", difficulty: "Moderate", fees: "₹20K–1L (5yr)", salary: "₹5–12 LPA", tag: "🛟", month: "May 2027", when: "May", fmtMode: "Offline · 1.5 hrs", fmtQs: "120 Qs — GK, Mental Ability, Legal Aptitude", cutoff: "Rank under 3,000 for OU Law / state law colleges", fmtExtra: "Govt law colleges here charge among the lowest fees in India", link: "lawcet.tsche.ac.in", colleges: "OU Law College Hyderabad, AU Law College Vizag" },
  { name: "Pearl Academy Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Fashion / Design / Media — Pearl Academy campuses", difficulty: "Moderate", fees: "₹12–18L (3yr, private)", salary: "₹5–10 LPA", tag: "", month: "Jan 2027", when: "Jan–Mar", fmtMode: "Online aptitude + GD/PI", fmtQs: "Creative aptitude test + Group Discussion + Interview", cutoff: "Portfolio and interview performance weighted alongside aptitude", fmtExtra: "Creative portfolio submission matters as much as the written component", link: "pearlacademy.com", colleges: "Pearl Academy Delhi, Mumbai, Jaipur, Bengaluru" },
  { name: "Srishti Design Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Communication Design, Film, Liberal Arts — Srishti-Manipal", difficulty: "Moderate", fees: "₹8–14L (4yr)", salary: "₹5–12 LPA", tag: "", month: "Jan 2027", when: "Jan–Feb", fmtMode: "Portfolio + Online test + Interview", fmtQs: "Situation-based creative tasks + written comprehension", cutoff: "Portfolio and interview performance — no standard rank system", fmtExtra: "Project-based learning focus — one of India's most progressive design institutions", link: "srishti.ac.in", colleges: "Srishti-Manipal Institute of Art, Design & Technology, Bengaluru" },
  { name: "KLEE", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Kerala state law colleges — 5yr & 3yr LLB", difficulty: "Moderate", fees: "₹20K–1L (5yr)", salary: "₹5–14 LPA", tag: "", month: "Apr 2027", when: "April", fmtMode: "Offline · 2 hrs", fmtQs: "200 MCQs — GK, Mental Ability, English, Legal Aptitude", cutoff: "Rank under 2,000 for a government law college seat", fmtExtra: "Kerala domicile essential — very low fees at government colleges", link: "cee.kerala.gov.in", colleges: "Govt Law College Ernakulam, Govt Law College Thiruvananthapuram" },
  { name: "AMU Humanities Entrance", stream: "arts", subj: "Any", reqMaths: false, reqBio: false, gets: "Aligarh Muslim University — BA Hons, BPA, B.Lib.Sc.", difficulty: "Moderate", fees: "Low (central univ)", salary: "₹4–9 LPA", tag: "", month: "May 2027", when: "May", fmtMode: "Offline · MCQ + descriptive", fmtQs: "Varies by programme — typically ~100 Qs", cutoff: "Rank under 1,000 for popular programmes", fmtExtra: "Central university fees — Urdu/Arabic-medium options and research culture unique to AMU", link: "amucontrollerexams.com", colleges: "Aligarh Muslim University, Aligarh" },
];

const UNDERRATED = [
  { name: "ISI Admission Test", where: "Indian Statistical Institute, Kolkata", why: "India's top Maths/Stats institute — tiny applicant pool vs JEE/NEET, low fees, runs its own quiet entrance.", link: "admission.isical.ac.in" },
  { name: "CMI Entrance", where: "Chennai Mathematical Institute", why: "Elite, research-mentored, almost unknown outside Olympiad circles. Strong Olympiad rank can waive the test.", link: "cmi.ac.in" },
  { name: "CUSAT CAT", where: "Cochin University of Science & Technology, Kochi", why: "Central-govt-aided university B.Tech at 20–30% of private college fees — almost nobody outside Kerala applies for it.", link: "cusat.ac.in" },
  { name: "AMU Engineering Entrance", where: "Aligarh Muslim University", why: "A central-university B.Tech most students forget to apply for since it isn't via JEE or CUET.", link: "amucontrollerexams.com" },
  { name: "AFMC (via NEET)", where: "Armed Forces Medical College, Pune", why: "Same NEET score, but leads to an MBBS plus guaranteed officer commission in the Armed Forces.", link: "afmc.nic.in" },
  { name: "JIPMAT", where: "IIM Bodh Gaya / IIM Jammu / IIM Sirmaur", why: "Same IIM degree as IPMAT but the entrance is significantly less competitive — most Commerce students don't know IIM Bodh Gaya exists.", link: "jipmat.nta.nic.in" },
  { name: "FTII / SRFTI", where: "Pune & Kolkata — Film & TV Institutes", why: "India's premier government film schools — genuinely tiny intake, almost never mentioned alongside standard career exams despite strong industry placement.", link: "ftii.ac.in" },
  { name: "ACET (Actuarial Science)", where: "Institute of Actuaries of India", why: "One of the highest-ceiling Commerce-adjacent careers in India, and most Commerce students have never heard of it — needs strong Maths, not accounting.", link: "actuariesindia.org" },
  { name: "JEXPO (WB Polytechnic)", where: "West Bengal Government Polytechnics", why: "A near-zero-cost route to the same B.Tech degree via lateral entry into 2nd year — genuinely underused as a fallback by WB students specifically.", link: "wbscte.co.in" },
];

const SCHOLARSHIPS = [
  { name: "MEXT", region: "Japan", note: "Free application. Full tuition + stipend + airfare." },
  { name: "Global Korea Scholarship", region: "South Korea", note: "Free application. Tuition + stipend + a free Korean-language year." },
  { name: "Türkiye Scholarships", region: "Turkey", note: "Free application. Among the most accessible fully-funded programmes." },
  { name: "Chinese Govt Scholarship (CSC)", region: "China", note: "Near-free application. Tuition + accommodation + stipend." },
  { name: "Central Sector Scheme", region: "India-wide", note: "Free, via National Scholarship Portal. Merit + income based, renewable." },
  { name: "SVMCM", region: "West Bengal", note: "Free. WB's own scholarship, Class 11 through PG." },
  { name: "National Overseas Scholarship", region: "India (SC/ST/notified)", note: "Free. Govt of India fully funds study abroad, income-capped." },
  { name: "PM YASASVI", region: "India-wide (OBC/EBC/DNT)", note: "Free, via NSP. Top-class school scholarship covering Classes 9 & 11 — feeds directly into board preparation support." },
  { name: "Ishan Uday", region: "North-East India", note: "Free. UGC scholarship for NE students joining central or state universities outside their home state." },
  { name: "Post-Matric SC/ST Scholarship", region: "India-wide", note: "Free. State + central govt funds tuition + maintenance allowance for SC/ST students at any recognised college." },
];

const MONTH_ORDER = ["Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027", "Aug 2027", "Dec 2027"];
const MONTH_EXTRAS = {
  "Dec 2026": ["CLAT & AILET registration deadlines — NLU applicants must apply now", "NID DAT Prelims window opens for Arts stream"],
  "Feb 2027": ["State CET registration windows open (MHT-CET/KCET/KEAM/EAMCET/COMEDK)", "NEET UG registration typically opens around this window"],
  "Mar 2027": ["GUJCET scheduled — Gujarat state students note", "CA Foundation May attempt registration window opens", "CSEET March session"],
  "Jun 2027": ["JEE Advanced result declared → JoSAA seat allocation begins", "JIPMAT result and IIM counselling"],
  "Jul 2027": ["JoSAA rounds 1–5 begin", "NEET & WBJEE counselling begins", "State Pharmacy CET counselling"],
  "Aug 2027": ["CSAB special rounds", "IISER/NISER counselling", "Most college sessions begin — confirm your seat acceptance"],
};

const RESERVATION = [
  { cat: "OBC-NCL", central: "27%", neet: "27%", wbjee: "OBC-A 10% + OBC-B 7%" },
  { cat: "SC", central: "15%", neet: "15%", wbjee: "22%" },
  { cat: "ST", central: "7.5%", neet: "7.5%", wbjee: "6%" },
  { cat: "EWS", central: "10%", neet: "10%", wbjee: "10% (income ≤₹8L)" },
  { cat: "PwD", central: "5% horizontal", neet: "5% horizontal", wbjee: "5%" },
];

const GLOSSARY = [
  { t: "JoSAA", d: "Joint Seat Allocation Authority — runs IIT/NIT/IIIT admissions" },
  { t: "CSAB", d: "Fills leftover NIT+ seats after JoSAA; needs a completely fresh registration" },
  { t: "AIQ", d: "All India Quota — 15% of NEET govt seats open to all states" },
  { t: "TFW", d: "Tuition Fee Waiver scheme for low-income students at NITs" },
  { t: "GFTI", d: "Government Funded Technical Institute, beyond IIT/NIT/IIIT" },
  { t: "Spot round", d: "Final, fast counselling round to fill last vacant seats — often overlooked" },
  { t: "Non-creamy layer", d: "OBC sub-status based on family income, needed for OBC-NCL reservation benefit" },
  { t: "Home state", d: "The state whose quota you're eligible for at NITs — typically where you studied 11th & 12th" },
  { t: "Integrated course", d: "Combined UG+PG (5yr) or UG+PhD programme — no gap year between degrees" },
  { t: "DASA", d: "Direct Admission of Students Abroad — NRI/OCI quota in NITs, SAT score required" },
  { t: "Deemed University", d: "Institute granted university status by MHRD — always verify AICTE/UGC/NMC approval before paying any fee" },
  { t: "Merit list", d: "Ranked list of qualified candidates used for round-wise seat allocation" },
];

const DOCS = ["Class 10 & 12 mark sheets + admit cards", "Aadhaar card", "Category certificate (SC/ST/OBC-NCL)", "Income certificate", "Domicile certificate", "Passport photos + signature scans", "Bank account in your own name"];

const RED_FLAGS = [
  "Management-quota seats sold outside official counselling",
  "Deemed universities calling themselves \"NIT/IIT-affiliated\"",
  "\"100% rank guarantee\" coaching ads",
  "Pressure to pay non-refundable seat-blocking fees in 24 hrs",
  "Colleges without valid AICTE/UGC/NMC approval for that year",
  "Scholarship \"consultants\" charging large upfront fees",
  "Websites with '.edu.in' domains mimicking official portals — always type URLs manually, never click email links",
  "Coaching institutes claiming their 'exclusive material' is the only way to clear any exam — NCERT + previous papers is almost always enough to start",
  "Offers of guaranteed NRI or management quota seats through WhatsApp or Instagram — no legitimate seat works that way",
];

const FALLBACKS = [
  { icon: Wrench, title: "Polytechnic → Lateral Entry", body: "3-yr govt diploma (₹10–30K/yr), then straight into 2nd year B.Tech — same degree, different door." },
  { icon: BookOpen, title: "NPTEL / SWAYAM", body: "Free IIT-faculty courses with certificates — genuinely strengthens an application during any gap." },
  { icon: Gem, title: "ITI / Skill India", body: "Govt-run vocational training leading directly to stable, employable trades." },
];

const FREE_PREP = {
  science: [
    { subj: "Physics", ch: "Physics Wallah, Mohit Tyagi, Khan Academy", bk: "NCERT, HC Verma, DC Pandey" },
    { subj: "Chemistry", ch: "Physics Wallah, Vedantu, ATP STAR", bk: "NCERT, OP Tandon, MS Chouhan" },
    { subj: "Maths", ch: "Physics Wallah, Neha Agrawal, MathonGo", bk: "NCERT, RD Sharma, Cengage" },
    { subj: "Biology", ch: "Physics Wallah, Vedantu Biotonic, NEETprep", bk: "NCERT, Trueman's, MTG" },
  ],
  commerce: [
    { subj: "Accounts & Law", ch: "ICAI's own free BOS material, Unacademy CA Foundation", bk: "ICAI study modules (free PDF)" },
    { subj: "Economics & Maths", ch: "Physics Wallah Commerce, StudyIQ", bk: "NCERT Economics, ICAI modules" },
    { subj: "CUET Commerce Domain", ch: "Unacademy CUET Commerce, Vedantu", bk: "NCERT Business Studies & Accountancy" },
    { subj: "General Test (GAT)", ch: "StudyIQ current affairs, Testbook", bk: "Lucent's GK, NCERT Pol Sci" },
  ],
  arts: [
    { subj: "GK / Current Affairs", ch: "StudyIQ, Unacademy CUET/CLAT", bk: "NCERT (Pol Sci, History, Sociology)" },
    { subj: "English & Reasoning", ch: "Unacademy, Testbook free content", bk: "Any standard verbal reasoning guide" },
    { subj: "Legal Reasoning (CLAT)", ch: "LawSikho free content, Unacademy CLAT", bk: "Universal's CLAT guide, NCERT Pol Sci" },
    { subj: "Design Aptitude", ch: "Design Sensei, NID/NIFT prep channels", bk: "Previous years' NID/UCEED papers (free online)" },
  ],
  all: [{ subj: "General", ch: "NCERT's own site — every textbook free as PDF", bk: "NTA's official previous-year papers, free" }],
};

const SITUATIONS = [
  { icon: "⏳", title: "Lost half of Class 12", who: "A few months went to distraction or a rough patch — boards feel closer than they should.", steps: ["Triage every untouched chapter, ranked by board weightage", "Board syllabus first — it's 70–80% of most entrance prep anyway", "Scale ambitions this cycle: safest option becomes the real target"] },
  { icon: "🌀", title: "Lost all of Class 11", who: "Class 11 barely happened. Class 12 now carries two years of ground.", steps: ["Rebuild Class 11 in parallel, chapter by chapter — don't skip it", "Look for a combined foundation + 12th batch instead of solo effort", "Boards first this cycle; keep a drop year genuinely on the table"] },
  { icon: "🚨", title: "Lost all of Class 12", who: "Boards are close and the syllabus is untouched. Tightest spot here — still recoverable.", steps: ["Emergency mode: pass boards respectably, nothing else yet", "Don't chase full entrance syllabus in the weeks left", "Decide on a drop year now, not after results — saves months"] },
  { icon: "🏆", title: "Aced Class 11 & 12", who: "Strong, consistent fundamentals — the question is how to convert that.", steps: ["Shift to mock-test volume, timing, and error analysis", "Consider the Olympiad circuit for a genuine edge", "Aim wide: your stream's top-tier options overlap in prep"] },
  { icon: "🔄", title: "Repeater / Gap Year", who: "Already sat one cycle. Score didn't convert. Now with a full year ahead.", steps: ["Cold-start with a mock test today — know your real baseline, not your memory of it", "Identify the 2–3 root causes the last attempt didn't work; address those specifically", "Weekly targets, not just an exam date — the gap year is the plan itself"] },
];

const DROP_PROS = ["10–12 undivided months, zero board distractions", "Time for 4 revision cycles instead of 1", "You already know real exam pressure & timing", "Documented score jumps for a structured plan"];
const DROP_CONS = ["A full year later into college than your batch", "Real cost — coaching/living for another year", "No guaranteed improvement without a new approach", "Genuine isolation & psychological pressure"];

const FAQS = [
  { q: "Does a drop year reduce my JEE Main attempts?", a: "Yes — JEE Main's window is 3 consecutive years from your Class 12 passing year, whether you attempt or not. A drop year quietly uses up one of those years." },
  { q: "Can I sit JEE and NEET the same year?", a: "Yes, no restriction — different exam dates, and PCMB prep overlaps heavily across both anyway." },
  { q: "Do CA / CS / CMA cap the number of attempts?", a: "No — unlike JEE Main, ICAI/ICSI/ICMAI don't cap attempts. You can re-sit a paper across sessions until you clear it." },
  { q: "Does CUET or CLAT have a JEE-style attempt limit?", a: "No — both are open to any Class-12-passed candidate within each year's own eligibility rules, far less restrictive than JEE Main." },
  { q: "What happens if I miss a JoSAA round?", a: "If you're just not allotted a seat, you stay in the pool automatically. If you ARE allotted and don't respond by the deadline, your candidature can be cancelled — always check your login after each round." },
  { q: "Do I need 75% in boards even with a good JEE rank?", a: "Yes — NIT/IIIT/CFTI admission separately requires 75% aggregate in boards (or top 20 percentile), 65% for SC/ST/PwD, regardless of your JEE score." },
  { q: "Is there an age limit for JEE Main or NEET?", a: "Neither currently enforces an upper age limit, following legal rulings. NEET UG does require a minimum age of 17 by December 31 of the admission year." },
  { q: "Does NEET test Maths at all?", a: "No — NEET is Physics, Chemistry and Biology only. PCB students (no Maths) are fully eligible with no disadvantage on this specific exam." },
  { q: "Can a Commerce or Arts student still try Science exams later?", a: "Generally no for Maths/PCM-locked exams like JEE Main — but CUET, CLAT, IPMAT and NDA (Army wing) stay open across streams, so cross-stream pivots are still possible through those." },
  { q: "Can I switch from B.Com into law or CA later on?", a: "Yes — CLAT/AILET are open to any stream and any year of graduation isn't required for the 5-year integrated route straight after 12th. CA Foundation is also open to any stream right after 12th, so neither path requires you to have started Commerce with that specific plan." },
  { q: "Does a design portfolio matter for NID even with a good DAT score?", a: "Yes — DAT Prelims is a screening MCQ round, but the Studio Test and later interview weigh creative/portfolio work heavily. A high Prelims score gets you to the next round, it doesn't guarantee admission on its own." },
  { q: "Is ACET (Actuarial Science) worth it if I'm not sure about a Maths-heavy career?", a: "It's a genuinely narrow, demanding path — strong Maths/Stats fundamentals are non-negotiable, and the real qualification comes from clearing multiple professional exams after ACET, not the entrance itself. Worth it only if you enjoy quantitative problem-solving specifically, not as a generic backup." },
  { q: "Can I appear for JEE Advanced without sitting JEE Main?", a: "No — JEE Advanced requires you to be in the top 2.5 lakh of JEE Main Paper 1 qualifiers in the same year. You cannot attempt Advanced directly without qualifying Main first." },
  { q: "What is the difference between IPMAT and JIPMAT?", a: "IPMAT (IIM Indore's own test) gives access to IIM Indore and IIM Rohtak's 5-year Integrated Programme. JIPMAT (conducted by NTA) gives access to IIM Bodh Gaya, IIM Jammu, and IIM Sirmaur — less competitive, same IIM degree." },
  { q: "Do state law exams (MHCET Law, KLEE, LAWCET) conflict with CLAT dates?", a: "Usually not — state law exams are scheduled independently of CLAT, so you can appear for all of them in the same cycle. Always check official calendars once notifications drop." },
  { q: "Is a gap year treated differently for NEET compared to JEE Main?", a: "For NEET there's currently no attempt cap (as of 2027 cycle). For JEE Main, the window is 3 consecutive years from your Class 12 passing year — a gap year uses one of those years whether you attempt or not. NEET gives you more flexibility on this specific point." },
  { q: "What does 'no negative marking' actually mean in practice for exams like VITEEE?", a: "It means you should attempt every single question — leaving a question blank has the same result as getting it wrong. This fundamentally changes exam strategy: speed and coverage beat selective caution." },
];

const SALARY_DATA = [
  { name: "Merchant Navy", value: 48, stream: "science", fill: "#8fb4e3" },
  { name: "IIM IPM (post-MBA)", value: 22, stream: "commerce", fill: "#9bc9a0" },
  { name: "NIT CSE", value: 20, stream: "science", fill: "#8fb4e3" },
  { name: "NLU Law", value: 14, stream: "arts", fill: "#e7a0ae" },
  { name: "NISER (Science)", value: 12, stream: "science", fill: "#8fb4e3" },
  { name: "Design (NID/NIFT)", value: 10, stream: "arts", fill: "#e7a0ae" },
  { name: "CA (qualified)", value: 8, stream: "commerce", fill: "#9bc9a0" },
  { name: "State CET Engg", value: 6, stream: "science", fill: "#8fb4e3" },
  { name: "Govt Bank PO (B.Com)", value: 5, stream: "commerce", fill: "#9bc9a0" },
  { name: "TISS / Social Work", value: 5, stream: "arts", fill: "#e7a0ae" },
  { name: "IMU CET Officer Track", value: 15, stream: "science", fill: "#8fb4e3" },
  { name: "CSEET → CS", value: 7, stream: "commerce", fill: "#9bc9a0" },
  { name: "IIMC / Journalism", value: 6, stream: "arts", fill: "#e7a0ae" },
  { name: "NDA Officer (any wing)", value: 10, stream: "all", fill: "#e8b86d" },
  { name: "ISI/CMI (Stats/Maths)", value: 15, stream: "science", fill: "#8fb4e3" },
  { name: "BITSAT (BITS Pilani)", value: 14, stream: "science", fill: "#8fb4e3" },
  { name: "UCEED Design (IIT)", value: 11, stream: "science", fill: "#8fb4e3" },
  { name: "AFMC (MBBS + Officer)", value: 12, stream: "science", fill: "#8fb4e3" },
  { name: "ICAR AIEEA (Agri)", value: 7, stream: "science", fill: "#8fb4e3" },
  { name: "State Pharmacy CET", value: 5, stream: "science", fill: "#8fb4e3" },
  { name: "CMA (qualified)", value: 7, stream: "commerce", fill: "#9bc9a0" },
  { name: "NPAT/SET (NMIMS BBA)", value: 6, stream: "commerce", fill: "#9bc9a0" },
  { name: "AILET (NLU Delhi)", value: 13, stream: "arts", fill: "#e7a0ae" },
  { name: "NIFT (Fashion Design)", value: 6, stream: "arts", fill: "#e7a0ae" },
  { name: "CUET → Central Univ BSc", value: 6, stream: "all", fill: "#e8b86d" },
  { name: "IIT B.Tech (JEE Advanced)", value: 25, stream: "science", fill: "#8fb4e3" },
  { name: "TANCET / GUJCET State Engg", value: 6, stream: "science", fill: "#8fb4e3" },
  { name: "KIITEE / AEEE / PESSAT", value: 8, stream: "science", fill: "#8fb4e3" },
  { name: "JIPMAT (IIM — post-MBA)", value: 16, stream: "commerce", fill: "#9bc9a0" },
  { name: "GGSIPU BBA (IP University)", value: 6, stream: "commerce", fill: "#9bc9a0" },
  { name: "LSAT India (Private Law)", value: 10, stream: "arts", fill: "#e7a0ae" },
  { name: "MHCET / KLEE (State Law)", value: 7, stream: "arts", fill: "#e7a0ae" },
  { name: "Pearl / Srishti Design", value: 7, stream: "arts", fill: "#e7a0ae" },
];

const PLAN_STEPS = [
  { t: "Right Now — Lock the Syllabus", d: "Whatever your stream, board syllabus completion comes first — it underwrites 70–80% of every entrance exam on this app." },
  { t: "This Week — Build One Strong Backup", d: "Every top choice needs a safety net. Pick one lower-pressure exam that genuinely leads somewhere good — CUET + one state CET costs almost nothing extra to add." },
  { t: "This Year — Register Widely", d: "Prep overlaps heavily within a stream. Sit for every exam that shares your syllabus — more attempts, more safety nets, more leverage." },
  { t: "Know Your Financial Aid", d: "NISER pays a stipend. IIT/NIT waive fees under ₹5–9L income. Central universities charge as little as ₹5,000/yr. Check before assuming a top college is out of reach." },
  { t: "Keep A Realistic Scenario Map", d: "Every outcome on this app — top choice or fifth choice — leads somewhere genuinely good. No single exam decides your future." },
  { t: "Tell Someone Your Plan", d: "Announcing your targets to a parent, teacher, or trusted friend builds accountability — and means someone will notice early if things start going off track." },
];

const TABS = [
  { id: "home", label: "Exams", icon: ListChecks },
  { id: "advisor", label: "Smart Advisor", icon: Sparkles },
  { id: "compare", label: "Compare", icon: Scale },
  { id: "situation", label: "Situation", icon: Compass },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "dropyear", label: "Drop Year", icon: Wind },
  { id: "counselling", label: "Counselling", icon: Landmark },
  { id: "redflags", label: "Red Flags", icon: ShieldAlert },
  { id: "underrated", label: "Underrated", icon: Gem },
  { id: "toolkit", label: "Toolkit", icon: FileText },
  { id: "freeprep", label: "Zero-Cost Prep", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "wellbeing", label: "Wellbeing", icon: HeartHandshake },
  { id: "salary", label: "Salary", icon: Wallet },
  { id: "plan", label: "Your Plan", icon: MapPin },
];
const VALID_STREAMS = Object.keys(STREAM_META);
const VALID_TABS = TABS.map((t) => t.id);

/* ────────────────────────────────────────────────────────────
   PRIMITIVES
──────────────────────────────────────────────────────────── */

function ClayCard({ children, className = "", style = {} }) {
  return <div className={`clay-card clay-pop ${className}`} style={style}>{children}</div>;
}

function Pill({ active, onClick, children, icon: Icon, tone }) {
  return (
    <button onClick={onClick} className={`clay-pill ${active ? "clay-pill-active" : ""} ${tone ? `tone-${tone}` : ""}`}>
      {Icon && <Icon size={15} strokeWidth={2.4} />}
      <span>{children}</span>
    </button>
  );
}

function SectionHead({ eyebrow, title, body }) {
  return (
    <div className="mb-6">
      <div className="clay-eyebrow">{eyebrow}</div>
      <h2 className="clay-h2">{title}</h2>
      {body && <p className="clay-body-text mt-2 max-w-2xl">{body}</p>}
    </div>
  );
}

function Chip({ children, bg, color }) {
  return <span className="clay-node" style={{ background: bg, color }}>{children}</span>;
}

/* ────────────────────────────────────────────────────────────
   MAIN APP
──────────────────────────────────────────────────────────── */

function parseHash() {
  const raw = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
  const [s, t] = raw.split("/");
  return {
    stream: VALID_STREAMS.includes(s) ? s : "all",
    tab: VALID_TABS.includes(t) ? t : "home",
  };
}

// Fee calculator — approx. registration fee per exam (INR). Module-level so it's not recreated per render.
const FEE_MAP = {
  "JEE Main": 650, "JEE Advanced": 400, "NEET UG": 1700, "BITSAT": 3400,
  "VITEEE": 1150, "SRMJEEE": 1200, "Manipal MET": 650, "KIITEE": 1350,
  "AEEE": 1000, "PESSAT": 800, "CUSAT CAT": 700, "TANCET": 500,
  "GUJCET": 300, "OJEE": 500, "MHT-CET": 800, "KCET": 500,
  "WBJEE": 500, "COMEDK UGET": 1600, "CLAT": 4000, "AILET": 3500,
  "IPMAT": 2000, "JIPMAT": 800, "CUET UG": 350, "NDA": 100,
  "IMU CET": 1000, "NID DAT": 2000, "NIFT Entrance": 2000, "UCEED": 2000,
  "NATA / JEE Paper 2": 2000, "NCHM JEE": 800,
  "CA Foundation": 1500, "CSEET": 1000, "CMA Foundation": 1200, "ACET": 1200,
  "SSC CHSL": 100, "GGSIPU CET BBA": 1000, "UGAT": 500,
  "LSAT India": 3999, "MHCET Law": 800, "TS/AP LAWCET": 500, "KLEE": 300,
  "NPAT / SET": 2500, "IAT (IISER)": 500, "NEST": 500,
  "ISI Admission Test": 500, "CMI Entrance": 500,
  "AMU Engineering Entrance": 500, "AMU Humanities Entrance": 500,
  "AFMC (via NEET)": 0, "JEXPO": 200,
  "TISS-BAT": 800, "IIMC / Jamia MassComm": 500,
  "ICAR AIEEA": 800, "State Pharmacy CET": 500,
  "Pearl Academy Entrance": 1500, "Srishti Design Entrance": 1000,
  "FTII / SRFTI Entrance": 500, "NSD Entrance": 300,
  "WBJEE": 500,
};

export default function CareerAtlas() {
  const [initial] = useState(parseHash);
  const [stream, setStream] = useState(initial.stream);
  const [tab, setTab] = useState(initial.tab);
  const [subjFilter, setSubjFilter] = useState("all"); // all | nomaths | nobio
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("ca-dark") === "1"; } catch { return false; }
  });
  const [starred, setStarred] = useState(() => {
    try {
      const raw = localStorage.getItem("ca-starred");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [checked, setChecked] = useState(() => {
    try {
      const raw = localStorage.getItem("ca-checked");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());
  const [showOnboarding, setShowOnboarding] = useState(() => !(typeof window !== "undefined" && window.location.hash && window.location.hash.length > 1));
  const [feeCalcOpen, setFeeCalcOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Smart Advisor State
  const [advisorStep, setAdvisorStep] = useState(0);
  const [advisorData, setAdvisorData] = useState({ stream: "", maths: null, bio: null, budget: null, stage: null });

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Persist dark mode
  useEffect(() => { try { localStorage.setItem("ca-dark", dark ? "1" : "0"); } catch {} }, [dark]);

  // Persist starred exams
  useEffect(() => {
    try { localStorage.setItem("ca-starred", JSON.stringify([...starred])); } catch {}
  }, [starred]);

  // Persist checked items
  useEffect(() => {
    try { localStorage.setItem("ca-checked", JSON.stringify([...checked])); } catch {}
  }, [checked]);

  // keep URL hash in sync so the view is shareable / survives refresh
  useEffect(() => {
    window.location.hash = `${stream}/${tab}`;
  }, [stream, tab]);

  useEffect(() => {
    const onHashChange = () => {
      const p = parseHash();
      setStream(p.stream);
      setTab(p.tab);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggleStar = useCallback((name) => {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  const toggleCheck = useCallback((id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleExpanded = useCallback((name) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  const pickStream = (id) => {
    setStream(id);
    setSubjFilter("all");
    setShowOnboarding(false);
  };

  const filteredExams = useMemo(() => {
    const q = query.toLowerCase();
    return EXAMS.filter((e) => {
      const matchesStream = stream === "all" || e.stream === stream || e.stream === "all";
      const matchesQuery =
        e.name.toLowerCase().includes(q) ||
        e.gets.toLowerCase().includes(q) ||
        (e.colleges || "").toLowerCase().includes(q);
      const matchesStar = !onlyStarred || starred.has(e.name);
      const matchesSubj =
        stream !== "science" || subjFilter === "all"
          ? true
          : subjFilter === "nomaths"
          ? !e.reqMaths
          : subjFilter === "nobio"
          ? !e.reqBio
          : true;
      return matchesStream && matchesQuery && matchesStar && matchesSubj;
    });
  }, [stream, query, onlyStarred, starred, subjFilter]);

  const examsByMonth = useMemo(() => {
    const relevant = EXAMS.filter((e) => stream === "all" || e.stream === stream || e.stream === "all");
    const grouped = {};
    relevant.forEach((e) => {
      if (!grouped[e.month]) grouped[e.month] = [];
      grouped[e.month].push(e);
    });
    return MONTH_ORDER.filter((m) => grouped[m] || MONTH_EXTRAS[m]).map((m) => ({
      month: m,
      exams: grouped[m] || [],
      extras: MONTH_EXTRAS[m] || [],
    }));
  }, [stream]);

  const [salaryOnlyStream, setSalaryOnlyStream] = useState(false);
  const filteredSalary = useMemo(() => {
    if (!salaryOnlyStream || stream === "all") return SALARY_DATA;
    return SALARY_DATA.filter((s) => s.stream === stream || s.stream === "all");
  }, [stream, salaryOnlyStream]);

  const starredExams = useMemo(() => EXAMS.filter((e) => starred.has(e.name)), [starred]);
  const [compareSelected, setCompareSelected] = useState(() => new Set());
  const compareExams = useMemo(
    () => (compareSelected.size > 0 ? EXAMS.filter((e) => compareSelected.has(e.name)) : starredExams.slice(0, 3)),
    [compareSelected, starredExams]
  );

  const toggleCompare = useCallback((name) => {
    setCompareSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else {
        if (next.size >= 3) return prev; // cap at 3
        next.add(name);
      }
      return next;
    });
  }, []);

  const [copied, setCopied] = useState(false);
  const copyShortlist = useCallback(() => {
    const lines = starredExams.map((e) => `• ${e.name} — ${e.gets} (${e.when}, ${e.link})`);
    const text = `My starred exams — Career Atlas\n\n${lines.join("\n")}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [starredExams]);

  // WhatsApp share
  const shareWhatsApp = useCallback(() => {
    const lines = starredExams.map((e) => `• ${e.name} — ${e.gets} (${e.link})`);
    const text = encodeURIComponent(`My Class 12 exam shortlist (Career Atlas):\n\n${lines.join("\n")}\n\nFull guide: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [starredExams]);

  // Share URL
  const shareUrl = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    });
  }, []);

  // ICS calendar export
  const exportICS = useCallback(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const baseYear = 2027;
    const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const events = starredExams
      .filter((e) => e.when && e.month)
      .map((e) => {
        const mStr = e.month.replace(" 2027", "").replace(" 2026", "").trim();
        const yr = e.month.includes("2026") ? 2026 : baseYear;
        const mIdx = monthMap[mStr.slice(0, 3)];
        if (mIdx === undefined) return null;
        const d = new Date(yr, mIdx, 15);
        const dtStart = icsDate(d);
        const dtEnd = icsDate(new Date(yr, mIdx, 16));
        return [
          "BEGIN:VEVENT",
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:${e.name} exam (approx.)`,
          `DESCRIPTION:${e.gets}. Link: https://${e.link}`,
          `UID:careerAtlas-${e.name.replace(/\s/g, "-")}@ca`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .filter(Boolean);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "CALSCALE:GREGORIAN", "PRODID:-//CareerAtlas//EN", ...events, "END:VCALENDAR"].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "career-atlas-exams.ics";
    a.click();
  }, [starredExams]);

  // Fee calculator data — approx. registration fee per exam (INR)
  // totalFees uses module-level FEE_MAP (defined above the component)
  const totalFees = useMemo(
    () => starredExams.reduce((sum, e) => sum + (FEE_MAP[e.name] || 800), 0),
    [starredExams]
  );

  // Smart Advisor Recommendation Engine
  const advisorResults = useMemo(() => {
    if (advisorStep !== 5 || !advisorData.stage) return null;
    const { stream: advStream, maths, bio, budget, stage } = advisorData;
    
    // 1. Filter raw pool by stream & subjects
    let pool = EXAMS.filter(e => e.stream === advStream || e.stream === "all");
    if (advStream === "science") {
      if (maths === false) pool = pool.filter(e => !e.reqMaths);
      if (bio === false) pool = pool.filter(e => !e.reqBio);
    } else {
      if (maths === false) pool = pool.filter(e => !e.reqMaths);
    }
    
    // 2. Budget constraint filter
    if (budget === "low") {
      const expensivePrivate = ["BITSAT", "VITEEE", "SRMJEEE", "Manipal MET", "KIITEE", "AEEE", "PESSAT", "IPMAT", "NPAT / SET", "LSAT India", "Pearl Academy Entrance", "Srishti Design Entrance", "COMEDK UGET"];
      pool = pool.filter(e => !expensivePrivate.includes(e.name));
    }
    
    let priority = [];
    let backups = [];
    
    // 2. Logic by prep stage
    if (stage === "aced") {
      priority = pool.filter(e => e.difficulty === "Hard" || e.difficulty === "Moderate").slice(0, 3);
      backups = pool.filter(e => e.difficulty === "Easy-Mod" || e.tag === "🛟").slice(0, 3);
    } else if (stage === "average") {
      priority = pool.filter(e => e.difficulty === "Moderate" && e.tag !== "🛟").slice(0, 3);
      backups = pool.filter(e => e.difficulty === "Easy-Mod" || e.tag === "🛟").slice(0, 3);
    } else if (stage === "lost") {
      priority = pool.filter(e => e.difficulty === "Easy-Mod" || e.tag === "🛟").slice(0, 3);
      backups = pool.filter(e => e.difficulty === "Easy-Mod").slice(0, 3);
    } else if (stage === "drop") {
      priority = pool.filter(e => e.difficulty === "Hard" || e.difficulty === "Moderate").slice(0, 3);
      backups = pool.filter(e => e.difficulty === "Moderate" || e.tag === "🛟").slice(0, 3);
    }
    
    // Fallbacks if arrays are empty
    if (priority.length === 0) priority = pool.slice(0, 3);
    if (backups.length === 0) backups = pool.filter(e => !priority.includes(e)).slice(0, 3);
    
    // Action step from SITUATIONS
    let actionStr = "";
    if (stage === "aced") actionStr = SITUATIONS[3].steps[0];
    else if (stage === "average") actionStr = SITUATIONS[0].steps[1];
    else if (stage === "lost") actionStr = SITUATIONS[2].steps[0];
    else if (stage === "drop") actionStr = SITUATIONS[4].steps[0];

    return { priority, backups, actionStr };
  }, [advisorStep, advisorData]);

  const prepList = FREE_PREP[stream] || FREE_PREP.all;
  const meta = STREAM_META[stream];

  return (
    <div className={`clay-root ${dark ? "dark" : ""}`}>
      <style>{`

        .clay-root {
          --bg1: #f3eefb; --bg2: #fbefe7;
          --ink: #3d3557; --muted: #8177a0;
          --card: #f6f1fc;
          --sci: #8fb4e3; --sci-bg: #e4edfa;
          --com: #9bc9a0; --com-bg: #e7f3e5;
          --art: #e7a0ae; --art-bg: #fae6ea;
          --gold: #e8b86d; --gold-bg: #fbf0dd;
          --danger: #de8c82; --danger-bg: #fbe9e5;
          font-family: 'Outfit', sans-serif;
          color: var(--ink);
          min-height: 100vh;
          background: radial-gradient(ellipse 1200px 700px at 15% -10%, #fde3e9 0%, transparent 55%),
                      radial-gradient(ellipse 1000px 800px at 100% 0%, #dbe8fb 0%, transparent 50%),
                      linear-gradient(160deg, var(--bg1), var(--bg2));
          padding: 28px 18px 60px;
        }
        .clay-root.dark {
          --bg1: #241f38; --bg2: #2e2440;
          --ink: #f1ecfb; --muted: #b6adcf;
          --card: #322a49;
        }
        .clay-root * { box-sizing: border-box; }

        .clay-card {
          background: var(--card);
          border-radius: 26px;
          padding: 22px;
          box-shadow: 9px 9px 18px rgba(120,105,160,.22), -8px -8px 16px rgba(255,255,255,.8), inset 0 1px 1px rgba(255,255,255,.6);
          border: 1px solid rgba(255,255,255,.6);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .clay-root.dark .clay-card { border-color: rgba(255,255,255,.06); }
        .clay-card:hover { transform: translateY(-3px); }

        @keyframes clayPop { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .clay-pop { animation: clayPop .35s ease both; }

        @keyframes heartbeat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.2); } 56% { transform: scale(1); } }

        .clay-pill {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
          padding: 9px 16px; border-radius: 999px; border: none; cursor: pointer;
          background: var(--card); color: var(--muted);
          box-shadow: 5px 5px 10px rgba(120,105,160,.22), -5px -5px 10px rgba(255,255,255,.8);
          transition: all .15s ease;
        }
        .clay-pill:hover { color: var(--ink); transform: translateY(-1px); }
        .clay-pill:active { transform: scale(.96); }
        .clay-pill-active { color: #4a3418; box-shadow: inset 4px 4px 8px rgba(120,90,20,.25), inset -4px -4px 8px rgba(255,255,255,.5); }
        .tone-science.clay-pill-active { background: var(--sci); color: #1c3252; }
        .tone-commerce.clay-pill-active { background: var(--com); color: #1d3a22; }
        .tone-arts.clay-pill-active { background: var(--art); color: #5a1f2c; }
        .tone-all.clay-pill-active { background: var(--gold); color: #4a3418; }

        .clay-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
        .clay-h1 { font-family: 'Baloo 2', sans-serif; font-weight: 700; letter-spacing: -.01em; }
        .clay-h2 { font-family: 'Baloo 2', sans-serif; font-size: 26px; font-weight: 700; color: var(--ink); }
        .clay-body-text { color: var(--muted); font-size: 14.5px; line-height: 1.65; }

        .clay-input {
          width: 100%; padding: 13px 18px; border-radius: 999px; border: none;
          background: var(--card); font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink);
          box-shadow: inset 4px 4px 9px rgba(120,105,160,.2), inset -4px -4px 9px rgba(255,255,255,.7);
        }
        .clay-input::placeholder { color: var(--muted); }
        .clay-input:focus { outline: 2px solid var(--gold); outline-offset: 2px; }

        .clay-node { border-radius: 999px; padding: 10px 16px; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 4px 4px 9px rgba(120,105,160,.22), -4px -4px 9px rgba(255,255,255,.8); }
        .clay-track { width: 3px; height: 22px; margin: 0 auto; border-radius: 2px;
          background: repeating-linear-gradient(180deg, var(--muted) 0 4px, transparent 4px 8px); opacity:.35; }

        .clay-btn-icon {
          width: 40px; height: 40px; border-radius: 14px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: var(--card); color: var(--ink);
          box-shadow: 4px 4px 9px rgba(120,105,160,.22), -4px -4px 9px rgba(255,255,255,.8);
          transition: transform .15s;
        }
        .clay-btn-icon:hover { transform: scale(1.06); }
        .clay-btn-icon:active { transform: scale(.92); box-shadow: inset 3px 3px 6px rgba(120,105,160,.3), inset -3px -3px 6px rgba(255,255,255,.6); }

        .clay-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 999px; text-decoration: none; background: #3d3557; color: #f6f1fc !important; cursor: pointer; }
        .clay-root.dark .clay-pill { box-shadow: 5px 5px 10px rgba(0,0,0,.35), -5px -5px 10px rgba(255,255,255,.04); }
        .clay-root.dark .clay-card { box-shadow: 9px 9px 18px rgba(0,0,0,.4), -8px -8px 16px rgba(255,255,255,.03), inset 0 1px 1px rgba(255,255,255,.07); }
        .clay-root.dark .clay-btn-icon { box-shadow: 4px 4px 9px rgba(0,0,0,.4), -4px -4px 9px rgba(255,255,255,.03); }
        .clay-root.dark .clay-input { box-shadow: inset 4px 4px 9px rgba(0,0,0,.35), inset -4px -4px 9px rgba(255,255,255,.03); }

        .clay-check { width: 22px; height: 22px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: inset 3px 3px 6px rgba(120,105,160,.25), inset -3px -3px 6px rgba(255,255,255,.7); }
        .clay-check.on { background: var(--com); box-shadow: none; }

        @media (max-width: 720px) { .clay-h1 { font-size: 30px !important; } .clay-h2 { font-size: 21px; } }

        .clay-header-badge .badge-suffix { display: inline; }
        .clay-hero { padding: 40px 32px; }
        .clay-navrow {
          display: flex; gap: 8px; margin-bottom: 32px; justify-content: center; flex-wrap: wrap;
        }
        @media (max-width: 760px) {
          .clay-root { padding: 18px 12px 48px; }
          .clay-hero { padding: 24px 18px; }
          .clay-header-badge .badge-suffix { display: none; }
          .clay-navrow {
            flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto;
            padding-bottom: 4px; margin-left: -12px; margin-right: -12px; padding-left: 12px; padding-right: 12px;
            scrollbar-width: none;
          }
          .clay-navrow::-webkit-scrollbar { display: none; }
          .clay-navrow .clay-pill { flex-shrink: 0; }
          .clay-card { padding: 18px; border-radius: 22px; }
          .grid { gap: 12px !important; }
        }
        @media (max-width: 420px) {
          .clay-hero { padding: 20px 14px; }
          .clay-node { font-size: 11.5px; padding: 8px 12px; }
        }

        /* Sidebar layout for mobile */
        .mobile-menu-btn { display: none; }
        .clay-sidebar-overlay { display: none; }
        .clay-sidebar { display: none; }
        
        @media (max-width: 768px) {
          .clay-navrow { display: none; }
          .mobile-menu-btn { display: inline-flex; }
          
          .clay-sidebar-overlay {
            display: block; position: fixed; inset: 0; z-index: 999;
            background: rgba(30,25,45,.4); backdrop-filter: blur(8px);
            opacity: 0; pointer-events: none; transition: opacity .35s ease;
          }
          .clay-sidebar-overlay.open { opacity: 1; pointer-events: auto; }
          
          .clay-sidebar {
            display: flex; flex-direction: column; gap: 8px;
            position: fixed; top: 0; left: 0; bottom: 0; width: 290px;
            background: var(--card); z-index: 1000;
            padding: 35px 24px; overflow-y: auto;
            border-right: 1px solid rgba(255,255,255,.6);
            border-top-right-radius: 35px; border-bottom-right-radius: 35px;
            box-shadow: 15px 0 35px rgba(120,105,160,.15), inset -2px 0 5px rgba(255,255,255,.5);
            transform: translateX(-100%); transition: transform .45s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .clay-root.dark .clay-sidebar { border-color: rgba(255,255,255,.05); box-shadow: 15px 0 35px rgba(0,0,0,.4); }
          .clay-sidebar.open { transform: translateX(0); }
          
          .clay-sidebar .clay-pill { 
            width: 100%; justify-content: flex-start; padding: 14px 18px; font-size: 15px; 
            background: transparent; box-shadow: none; border: 1px solid transparent;
            opacity: 0; transform: translateX(-15px); transition: all .25s ease;
          }
          .clay-sidebar.open .clay-pill { opacity: 1; transform: translateX(0); }
          
          /* Stagger animations for children */
          .clay-sidebar.open .clay-pill:nth-child(2) { transition-delay: .05s; }
          .clay-sidebar.open .clay-pill:nth-child(3) { transition-delay: .10s; }
          .clay-sidebar.open .clay-pill:nth-child(4) { transition-delay: .15s; }
          .clay-sidebar.open .clay-pill:nth-child(5) { transition-delay: .20s; }
          .clay-sidebar.open .clay-pill:nth-child(6) { transition-delay: .25s; }
          .clay-sidebar.open .clay-pill:nth-child(7) { transition-delay: .30s; }
          .clay-sidebar.open .clay-pill:nth-child(8) { transition-delay: .35s; }
          .clay-sidebar.open .clay-pill:nth-child(9) { transition-delay: .40s; }
          .clay-sidebar.open .clay-pill:nth-child(10) { transition-delay: .45s; }
          .clay-sidebar.open .clay-pill:nth-child(11) { transition-delay: .50s; }
          .clay-sidebar.open .clay-pill:nth-child(12) { transition-delay: .55s; }
          .clay-sidebar.open .clay-pill:nth-child(13) { transition-delay: .60s; }
          .clay-sidebar.open .clay-pill:nth-child(14) { transition-delay: .65s; }
          .clay-sidebar.open .clay-pill:nth-child(15) { transition-delay: .70s; }
          .clay-sidebar.open .clay-pill:nth-child(16) { transition-delay: .75s; }
          .clay-sidebar.open .clay-pill:nth-child(17) { transition-delay: .80s; }
          
          .clay-sidebar .clay-pill.clay-pill-active {
            background: var(--card); color: var(--ink);
            box-shadow: inset 4px 4px 8px rgba(120,90,20,.15), inset -4px -4px 8px rgba(255,255,255,.5);
            border: 1px solid rgba(255,255,255,.4);
          }
        }

        .clay-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(30,25,45,.55);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .clay-onboard {
          max-width: 420px; width: 100%; text-align: center;
        }
      `}</style>

      {showOnboarding && (
        <div className="clay-overlay" onClick={() => setShowOnboarding(false)}>
          <div className="clay-onboard clay-card clay-pop" onClick={(e) => e.stopPropagation()}>
            <Sparkles size={26} style={{ color: "var(--gold)", marginBottom: 10 }} />
            <div className="clay-h2 mb-2">Which stream are you in?</div>
            <p className="clay-body-text mb-6">This shapes every tab — exams, formats, prep resources — around what's actually relevant to you.</p>
            <div className="flex flex-col gap-3">
              {Object.entries(STREAM_META).filter(([id]) => id !== "all").map(([id, m]) => {
                const Icon = m.icon;
                return (
                  <button key={id} onClick={() => pickStream(id)} className="clay-pill" style={{ justifyContent: "center", padding: "13px 18px", fontSize: 14.5 }}>
                    <Icon size={17} strokeWidth={2.4} /> {m.label}
                  </button>
                );
              })}
              <button onClick={() => setShowOnboarding(false)} className="clay-body-text mt-1" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, textDecoration: "underline" }}>
                Not sure yet — show me everything
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <button className="clay-btn-icon mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="clay-node clay-header-badge" style={{ background: "var(--card)" }}>
              <Sparkles size={14} /> Career Atlas<span className="badge-suffix"> · Class 12, All Streams</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={() => setOnlyStarred((v) => !v)} title="Show starred only" style={onlyStarred ? { background: "var(--gold)" } : {}}>
                <Star size={17} fill={onlyStarred ? "#4a3418" : "none"} />
              </button>
            )}
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={copyShortlist} title="Copy shortlist">
                {copied ? <Check size={17} color="var(--com)" /> : <Copy size={17} />}
              </button>
            )}
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={shareWhatsApp} title="Share on WhatsApp" style={{ background: "#25D366", color: "#fff" }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>W</span>
              </button>
            )}
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={exportICS} title="Export to Google Calendar (.ics)">
                <CalendarDays size={17} />
              </button>
            )}
            <button className="clay-btn-icon" onClick={shareUrl} title="Copy page URL">
              {urlCopied ? <Check size={17} color="var(--com)" /> : <ExternalLink size={17} />}
            </button>
            <button className="clay-btn-icon" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

        {/* ── FEE CALCULATOR BANNER ── */}
        {starred.size > 0 && (
          <div
            className="clay-card clay-pop mb-4"
            style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, cursor: "pointer" }}
            onClick={() => setFeeCalcOpen((v) => !v)}
          >
            <div className="flex items-center gap-3">
              <Wallet size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {starred.size} exam{starred.size > 1 ? "s" : ""} starred · approx. registration cost: <span style={{ color: "var(--gold)" }}>₹{totalFees.toLocaleString("en-IN")}</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="clay-body-text" style={{ fontSize: 12 }}>{feeCalcOpen ? "hide breakdown" : "see breakdown"}</span>
              <ChevronDown size={14} style={{ transform: feeCalcOpen ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--muted)" }} />
            </div>
          </div>
        )}
        {feeCalcOpen && starred.size > 0 && (
          <div className="clay-card clay-pop mb-5" style={{ padding: "16px 20px" }}>
            <div className="clay-eyebrow mb-3">Approximate registration fee per exam</div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {starredExams.map((e) => (
                <div key={e.name} className="flex justify-between text-sm" style={{ borderBottom: "1px solid rgba(120,105,160,.12)", paddingBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{e.name}</span>
                  <span className="clay-body-text">₹{(FEE_MAP[e.name] || 1000).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-3" style={{ borderTop: "2px solid rgba(120,105,160,.2)", fontWeight: 700 }}>
              <span>Total (approx.)</span>
              <span style={{ color: "var(--gold)" }}>₹{totalFees.toLocaleString("en-IN")}</span>
            </div>
            <p className="clay-body-text mt-2" style={{ fontSize: 11.5 }}>Fees are indicative and may vary by category (SC/ST/PwD often pay less). Always verify on the official site before applying.</p>
          </div>
        )}

        <ClayCard className="mb-8 clay-hero">
          <h1 className="clay-h1" style={{ fontSize: 44, lineHeight: 1.1, marginBottom: 14 }}>
            Every path out of Class 12,<br />
            <span style={{ color: "var(--gold)" }}>made tangible.</span>
          </h1>
          <p className="clay-body-text mb-7" style={{ maxWidth: 560 }}>
            Exams, colleges, and salaries for Science, Commerce and Arts — pick your
            stream below and everything reshapes around it. Star the exams you're
            actually targeting to pin them to the top.
          </p>

          <div className="flex flex-col items-center mb-8">
            <div className="clay-node" style={{ background: "var(--gold-bg)", color: "#4a3418" }}><MapPin size={14} /> You — Class 12</div>
            <div className="clay-track" />
            <div className="flex flex-wrap justify-center gap-3">
              {["science", "commerce", "arts"].map((s) => {
                const m = STREAM_META[s];
                const Icon = m.icon;
                return <div key={s} className="clay-node" style={{ background: m.chip, color: m.text }}><Icon size={14} /> {m.label}</div>;
              })}
            </div>
            <div className="clay-track" />
            <div className="clay-node" style={{ background: "var(--com-bg)", color: "#1d3a22" }}><GraduationCap size={14} /> Govt college · Debt-free</div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(STREAM_META).map(([id, m]) => (
              <Pill key={id} active={stream === id} tone={id} icon={m.icon} onClick={() => pickStream(id)}>{m.label}</Pill>
            ))}
          </div>
        </ClayCard>

        <div className={`clay-sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)} />
        <div className={`clay-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <span className="clay-h2" style={{ fontSize: 20 }}>Menu</span>
            <button className="clay-btn-icon" style={{ width: 32, height: 32 }} onClick={() => setIsSidebarOpen(false)}>
              <X size={16} />
            </button>
          </div>
          {TABS.map((t) => (
            <Pill key={t.id} active={tab === t.id} icon={t.icon} onClick={() => { setTab(t.id); setIsSidebarOpen(false); }}>
              {t.label}
            </Pill>
          ))}
        </div>

        <div className="clay-navrow">
          {TABS.map((t) => <Pill key={t.id} active={tab === t.id} icon={t.icon} onClick={() => setTab(t.id)}>{t.label}</Pill>)}
        </div>

        {/* ── HOME / EXAMS ── */}
        {tab === "home" && (
          <div key="home" className="clay-pop">
            <SectionHead eyebrow="Complete Overview" title={`${meta.label} Exams`} body="Every entrance exam worth knowing, filtered to your stream. Tap a card to see its format & marking scheme; tap the star to pin it." />
            <div className="relative mb-4">
              <Search size={16} style={{ position: "absolute", left: 18, top: 16, color: "var(--muted)" }} />
              <input className="clay-input" style={{ paddingLeft: 44 }} placeholder="Search exams — try 'medical', 'design', 'defence'…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {stream === "science" && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Pill active={subjFilter === "all"} onClick={() => setSubjFilter("all")}>Full PCMB</Pill>
                <Pill active={subjFilter === "nobio"} onClick={() => setSubjFilter("nobio")}>PCM only (no Bio)</Pill>
                <Pill active={subjFilter === "nomaths"} onClick={() => setSubjFilter("nomaths")}>PCB only (no Maths)</Pill>
              </div>
            )}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
              {filteredExams.map((e) => {
                const isOpen = expanded.has(e.name);
                return (
                  <ClayCard key={e.name} style={{ cursor: "pointer" }}>
                    <div onClick={() => toggleExpanded(e.name)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="clay-h2" style={{ fontSize: 17 }}>{e.name}</span>
                        <div className="flex items-center gap-2">
                          <span>{e.tag}</span>
                          <button onClick={(ev) => { ev.stopPropagation(); toggleStar(e.name); }} className="clay-btn-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                            <Star size={15} fill={starred.has(e.name) ? "var(--gold)" : "none"} color={starred.has(e.name) ? "var(--gold)" : "var(--muted)"} />
                          </button>
                        </div>
                      </div>
                      <p className="clay-body-text mb-1">{e.gets}</p>
                      <p className="clay-body-text mb-3" style={{ fontSize: 12, fontStyle: "italic" }}>e.g. {e.colleges}</p>
                      <div className="flex flex-wrap gap-2 text-xs mb-2">
                        <Chip bg="var(--danger-bg)" color="#7a3229">{e.difficulty}</Chip>
                        <Chip bg="var(--com-bg)" color="#1d3a22">{e.fees}</Chip>
                        <Chip bg="var(--sci-bg)" color="#1c3252">{e.salary}</Chip>
                        <Chip bg="var(--art-bg)" color="#5a1f2c">Needs: {e.subj}</Chip>
                      </div>
                      <p className="clay-body-text mb-3" style={{ fontSize: 11.5 }}><b style={{ color: "var(--ink)" }}>Roughly needs: </b>{e.cutoff}</p>
                      <div className="flex items-center justify-between">
                        <span className="clay-body-text" style={{ fontSize: 12 }}>{e.when}</span>
                        <div className="flex items-center gap-1" style={{ color: "var(--gold)", fontSize: 11.5, fontWeight: 700 }}>
                          {isOpen ? "Hide format" : "Show format"}
                          <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                        </div>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-3 pt-3" style={{ borderTop: "1px dashed rgba(120,105,160,.25)" }}>
                        <div className="flex flex-wrap gap-2 mb-3 text-xs">
                          <Chip bg="var(--gold-bg)" color="#4a3418">{e.fmtMode}</Chip>
                          <Chip bg="var(--gold-bg)" color="#4a3418">{e.fmtQs}</Chip>
                        </div>
                        <p className="clay-body-text mb-3"><b style={{ color: "var(--ink)" }}>Extra: </b>{e.fmtExtra}</p>
                        <a className="clay-link" href={`https://${e.link}`} target="_blank" rel="noreferrer">{e.link} <ExternalLink size={12} /></a>
                      </div>
                    )}
                  </ClayCard>
                );
              })}
              {filteredExams.length === 0 && (
                <ClayCard style={{ textAlign: "center" }}>
                  <p className="clay-body-text mb-3">Nothing matches — try clearing your search or filters.</p>
                  <button
                    className="clay-pill"
                    onClick={() => { setQuery(""); setOnlyStarred(false); setSubjFilter("all"); }}
                  >
                    <RotateCcw size={14} /> Clear filters
                  </button>
                </ClayCard>
              )}
            </div>
            <p className="clay-body-text mt-4" style={{ fontSize: 11.5, textAlign: "center" }}>Dates and links are indicative for the 2027 cycle — always confirm on the official site before applying.</p>
          </div>
        )}

        {/* ── SMART ADVISOR ── */}
        {tab === "advisor" && (
          <div key="advisor" className="clay-pop">
            <SectionHead eyebrow="Personalized Guide" title="Smart Advisor" body="Answer 3 questions to get a realistic, actionable exam strategy tailored to your situation." />
            
            {advisorStep === 0 && (
              <ClayCard className="text-center" style={{ padding: "40px 20px" }}>
                <Sparkles size={34} style={{ color: "var(--gold)", margin: "0 auto 16px" }} />
                <div className="clay-h2 mb-3">Let's build your strategy</div>
                <p className="clay-body-text mb-6 mx-auto" style={{ maxWidth: 400 }}>We'll look at your subjects and current prep level to recommend exactly what you should target — and what your backup should be.</p>
                <button className="clay-pill" style={{ background: "var(--gold)", color: "#4a3418", padding: "14px 28px", fontSize: 16 }} onClick={() => setAdvisorStep(1)}>
                  Start Questionnaire
                </button>
              </ClayCard>
            )}

            {advisorStep === 1 && (
              <ClayCard>
                <div className="clay-h2 mb-4">1. What's your stream?</div>
                <div className="flex flex-col gap-3">
                  {Object.entries(STREAM_META).filter(([id]) => id !== "all").map(([id, m]) => {
                    const Icon = m.icon;
                    return (
                      <button key={id} className="clay-pill justify-start" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => { setAdvisorData(p => ({ ...p, stream: id })); setAdvisorStep(2); }}>
                        <Icon size={18} style={{ marginRight: 8 }} /> {m.label}
                      </button>
                    )
                  })}
                </div>
              </ClayCard>
            )}

            {advisorStep === 2 && (
              <ClayCard>
                <div className="clay-h2 mb-4">2. Did you opt for Maths?</div>
                <div className="flex gap-3">
                  <button className="clay-pill flex-1 justify-center" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => {
                    setAdvisorData(p => ({ ...p, maths: true }));
                    if (advisorData.stream === "science") setAdvisorStep(3);
                    else setAdvisorStep(4);
                  }}>Yes</button>
                  <button className="clay-pill flex-1 justify-center" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => {
                    setAdvisorData(p => ({ ...p, maths: false }));
                    if (advisorData.stream === "science") setAdvisorStep(3);
                    else setAdvisorStep(4);
                  }}>No</button>
                </div>
              </ClayCard>
            )}

            {advisorStep === 3 && (
              <ClayCard>
                <div className="clay-h2 mb-4">3. Did you opt for Biology?</div>
                <div className="flex gap-3">
                  <button className="clay-pill flex-1 justify-center" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => { setAdvisorData(p => ({ ...p, bio: true })); setAdvisorStep(4); }}>Yes</button>
                  <button className="clay-pill flex-1 justify-center" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => { setAdvisorData(p => ({ ...p, bio: false })); setAdvisorStep(4); }}>No</button>
                </div>
              </ClayCard>
            )}

            {advisorStep === 4 && (
              <ClayCard>
                <div className="clay-h2 mb-2">4. Are high private college fees (₹15L+) an option?</div>
                <p className="clay-body-text mb-4">If you select No, we will filter out expensive private entrances and prioritize government/low-fee options like CUET and State CETs.</p>
                <div className="flex flex-col gap-3">
                  <button className="clay-pill justify-start" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => {
                    setAdvisorData(p => ({ ...p, budget: "high" }));
                    setAdvisorStep(5);
                  }}>✅ Yes, we can manage it for a top college.</button>
                  <button className="clay-pill justify-start" style={{ padding: "16px", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => {
                    setAdvisorData(p => ({ ...p, budget: "low" }));
                    setAdvisorStep(5);
                  }}>⛔ No, I strictly need govt colleges, low-fee options, or heavy scholarships.</button>
                </div>
              </ClayCard>
            )}

            {advisorStep === 5 && !advisorData.stage && (
              <ClayCard>
                <div className="clay-h2 mb-4">Final Check: Reality of Prep</div>
                <p className="clay-body-text mb-4">Be honest here. It helps us find realistic backups.</p>
                <div className="flex flex-col gap-3">
                  <button className="clay-pill justify-start" style={{ padding: "16px", textAlign: "left", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => setAdvisorData(p => ({ ...p, stage: "aced" }))}>
                    🏆 Aced Class 11 & 12 (Targeting top ranks)
                  </button>
                  <button className="clay-pill justify-start" style={{ padding: "16px", textAlign: "left", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => setAdvisorData(p => ({ ...p, stage: "average" }))}>
                    ⏳ Average prep (Mostly focused on passing Boards well)
                  </button>
                  <button className="clay-pill justify-start" style={{ padding: "16px", textAlign: "left", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => setAdvisorData(p => ({ ...p, stage: "lost" }))}>
                    🚨 Lost most of 11/12 (Barely started, need safe options)
                  </button>
                  <button className="clay-pill justify-start" style={{ padding: "16px", textAlign: "left", background: "var(--card)", border: "1px solid rgba(120,105,160,.2)" }} onClick={() => setAdvisorData(p => ({ ...p, stage: "drop" }))}>
                    🔄 Repeater / Gap Year
                  </button>
                </div>
              </ClayCard>
            )}

            {advisorStep === 5 && advisorData.stage && advisorResults && (
              <div className="space-y-6 clay-pop">
                <ClayCard style={{ background: "var(--gold-bg)", border: "2px solid var(--gold)" }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: "#4a3418", fontWeight: 700 }}>
                    <Compass size={18} /> Immediate Action Step
                  </div>
                  <p className="clay-body-text" style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{advisorResults.actionStr}</p>
                </ClayCard>

                <div>
                  <h3 className="clay-h2 mb-3">Priority Targets (Reach)</h3>
                  <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
                    {advisorResults.priority.map(e => (
                      <ClayCard key={e.name} style={{ padding: "16px" }}>
                        <div className="flex justify-between items-start mb-1">
                          <span style={{ fontWeight: 700 }}>{e.name}</span>
                          <button onClick={() => toggleStar(e.name)}>
                            <Star size={16} fill={starred.has(e.name) ? "var(--gold)" : "none"} color={starred.has(e.name) ? "var(--gold)" : "var(--muted)"} />
                          </button>
                        </div>
                        <p className="clay-body-text text-sm mb-2">{e.gets}</p>
                        <Chip bg="var(--danger-bg)" color="#7a3229">{e.difficulty}</Chip>
                      </ClayCard>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="clay-h2 mb-3">Safety Nets (Must Register)</h3>
                  <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
                    {advisorResults.backups.map(e => (
                      <ClayCard key={e.name} style={{ padding: "16px" }}>
                        <div className="flex justify-between items-start mb-1">
                          <span style={{ fontWeight: 700 }}>{e.name}</span>
                          <button onClick={() => toggleStar(e.name)}>
                            <Star size={16} fill={starred.has(e.name) ? "var(--gold)" : "none"} color={starred.has(e.name) ? "var(--gold)" : "var(--muted)"} />
                          </button>
                        </div>
                        <p className="clay-body-text text-sm mb-2">{e.gets}</p>
                        <Chip bg="var(--com-bg)" color="#1d3a22">{e.difficulty}</Chip>
                      </ClayCard>
                    ))}
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button className="clay-body-text" style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }} onClick={() => { setAdvisorStep(0); setAdvisorData({ stream: "", maths: null, bio: null, budget: null, stage: null }); }}>
                    Retake Questionnaire
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMPARE ── */}
        {tab === "compare" && (
          <div key="compare" className="clay-pop">
            <SectionHead eyebrow="Side By Side" title="Compare Exams" body="Pick up to 3 starred exams to line up against each other." />
            {starredExams.length === 0 ? (
              <ClayCard style={{ textAlign: "center" }}>
                <Star size={22} style={{ color: "var(--muted)", marginBottom: 10 }} />
                <p className="clay-body-text mb-3">You haven't starred any exams yet.</p>
                <button className="clay-pill" onClick={() => setTab("home")}>Go star some exams</button>
              </ClayCard>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  {starredExams.map((e) => (
                    <Pill key={e.name} active={compareExams.some((c) => c.name === e.name)} onClick={() => toggleCompare(e.name)}>{e.name}</Pill>
                  ))}
                </div>
                {compareExams.length === 0 ? (
                  <ClayCard><p className="clay-body-text">Pick at least one exam above to compare.</p></ClayCard>
                ) : (
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareExams.length}, minmax(220px, 1fr))` }}>
                    {compareExams.map((e) => (
                      <ClayCard key={e.name}>
                        <div className="clay-h2 mb-3" style={{ fontSize: 16 }}>{e.name}</div>
                        {[
                          ["Gets you", e.gets],
                          ["Needs", e.subj],
                          ["Difficulty", e.difficulty],
                          ["Fees", e.fees],
                          ["Salary", e.salary],
                          ["Cutoff", e.cutoff],
                          ["Mode", e.fmtMode],
                          ["When", e.when],
                        ].map(([k, v]) => (
                          <div key={k} className="mb-2.5 pb-2.5" style={{ borderBottom: "1px solid rgba(120,105,160,.15)" }}>
                            <div className="clay-eyebrow" style={{ fontSize: 9.5, marginBottom: 2 }}>{k}</div>
                            <div className="text-sm">{v}</div>
                          </div>
                        ))}
                        <a className="clay-link mt-1" href={`https://${e.link}`} target="_blank" rel="noreferrer">{e.link} <ExternalLink size={12} /></a>
                      </ClayCard>
                    ))}
                  </div>
                )}
                <div className="flex justify-center mt-6">
                  <button className="clay-pill" onClick={copyShortlist}>
                    <Copy size={14} /> {copied ? "Copied!" : `Copy full starred list (${starredExams.length})`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SITUATION ── */}
        {tab === "situation" && (
          <div key="situation" className="clay-pop">
            <SectionHead eyebrow="No Judgement, Just A Plan" title="Find Where You Actually Stand" body="Pick the card that honestly matches you." />
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
              {SITUATIONS.map((s) => (
                <ClayCard key={s.title}>
                  <div className="flex items-center gap-3 mb-2"><span style={{ fontSize: 26 }}>{s.icon}</span><span className="clay-h2" style={{ fontSize: 17 }}>{s.title}</span></div>
                  <p className="clay-body-text mb-3">{s.who}</p>
                  <ul className="space-y-2">{s.steps.map((step, i) => <li key={i} className="flex gap-2 text-sm"><span style={{ color: "var(--gold)" }}>→</span> {step}</li>)}</ul>
                </ClayCard>
              ))}
            </div>
          </div>
        )}

        {/* ── CALENDAR ── */}
        {tab === "calendar" && (
          <div key="calendar" className="clay-pop">
            <SectionHead eyebrow="Everything, One Timeline" title="Master Exam Calendar" body="Dec 2026 to Aug 2027 — every exam gets its own line, grouped by month. Filtered to your selected stream." />
            <div className="space-y-6">
              {examsByMonth.map(({ month, exams, extras }) => (
                <div key={month}>
                  <div className="clay-eyebrow mb-2" style={{ fontSize: 12 }}>{month}</div>
                  <div className="space-y-2">
                    {exams.map((e) => (
                      <ClayCard key={e.name} className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: "13px 20px" }}>
                        <div className="flex items-center gap-3">
                          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{e.name}</span>
                          <Chip bg="var(--sci-bg)" color="#1c3252">{e.when}</Chip>
                        </div>
                        <a className="clay-link" style={{ fontSize: 11 }} href={`https://${e.link}`} target="_blank" rel="noreferrer">{e.link} <ExternalLink size={11} /></a>
                      </ClayCard>
                    ))}
                    {extras.map((ex, i) => (
                      <ClayCard key={i} style={{ padding: "13px 20px", background: "var(--gold-bg)" }}>
                        <span style={{ fontSize: 13, color: "#4a3418" }}>{ex}</span>
                      </ClayCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DROP YEAR ── */}
        {tab === "dropyear" && (
          <div key="dropyear" className="clay-pop">
            <SectionHead eyebrow="A Real Option, Not A Failure" title="Should You Take A Drop Year?" body="10–12 undivided months to fix exactly what went wrong — weighed honestly against the real cost." />
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
              <ClayCard style={{ background: "var(--com-bg)" }}>
                <div className="flex items-center gap-2 mb-3 font-bold" style={{ color: "#1d3a22" }}><Check size={18} /> What it genuinely gives you</div>
                <ul className="space-y-2">{DROP_PROS.map((p, i) => <li key={i} className="text-sm flex gap-2" style={{ color: "#1d3a22" }}><Check size={14} className="mt-1 flex-shrink-0" /> {p}</li>)}</ul>
              </ClayCard>
              <ClayCard style={{ background: "var(--danger-bg)" }}>
                <div className="flex items-center gap-2 mb-3 font-bold" style={{ color: "#7a3229" }}><X size={18} /> What it genuinely costs</div>
                <ul className="space-y-2">{DROP_CONS.map((p, i) => <li key={i} className="text-sm flex gap-2" style={{ color: "#7a3229" }}><X size={14} className="mt-1 flex-shrink-0" /> {p}</li>)}</ul>
              </ClayCard>
            </div>
          </div>
        )}

        {/* ── COUNSELLING ── */}
        {tab === "counselling" && (
          <div key="counselling" className="clay-pop">
            <SectionHead eyebrow="The Part After The Exam" title="Counselling, Reservation & Documents" />
            <ClayCard className="mb-5">
              <div className="clay-h2 mb-2" style={{ fontSize: 16 }}>JoSAA: Freeze / Float / Slide</div>
              <p className="clay-body-text"><b style={{ color: "var(--ink)" }}>Freeze</b> = accept & exit counselling. <b style={{ color: "var(--ink)" }}>Float</b> = accept for now, stay open for a better seat. <b style={{ color: "var(--ink)" }}>Slide</b> = keep the college, stay open for a branch upgrade. Miss a response deadline after being allotted a seat, and your candidature can be cancelled — always check your login after every round. <b style={{ color: "var(--ink)" }}>CSAB</b> fills leftover NIT+ seats after JoSAA ends — but needs a completely fresh registration, your JoSAA choices don't carry over.</p>
            </ClayCard>
            <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
              <ClayCard>
                <div className="clay-h2 mb-3" style={{ fontSize: 16 }}>Reservation (approx.)</div>
                <div className="space-y-2">
                  {RESERVATION.map((r) => (
                    <div key={r.cat} style={{ borderBottom: "1px solid rgba(120,105,160,.15)", paddingBottom: 6 }}>
                      <div className="flex justify-between text-sm mb-0.5"><span style={{ fontWeight: 600 }}>{r.cat}</span><span className="clay-body-text">{r.central} <span style={{opacity:.6}}>(central)</span></span></div>
                      <div className="flex justify-end text-sm"><span className="clay-body-text">{r.wbjee} <span style={{opacity:.6}}>(WBJEE)</span></span></div>
                    </div>
                  ))}
                </div>
              </ClayCard>
              <ClayCard>
                <div className="clay-h2 mb-3" style={{ fontSize: 16 }}>Documents Folder</div>
                <ul className="space-y-2">{DOCS.map((d, i) => <li key={i} className="text-sm flex gap-2"><FileText size={14} className="mt-1 flex-shrink-0" style={{ color: "var(--gold)" }} /> {d}</li>)}</ul>
              </ClayCard>
            </div>
            <ClayCard>
              <div className="clay-h2 mb-3" style={{ fontSize: 16 }}>Quick Glossary</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                {GLOSSARY.map((g) => (
                  <div key={g.t} className="text-sm"><b style={{ color: "var(--ink)" }}>{g.t}</b> <span className="clay-body-text">— {g.d}</span></div>
                ))}
              </div>
            </ClayCard>
          </div>
        )}

        {/* ── RED FLAGS ── */}
        {tab === "redflags" && (
          <div key="redflags" className="clay-pop">
            <SectionHead eyebrow="Protect Yourself & Your Family's Money" title="Red Flags To Avoid" />
            <ClayCard style={{ background: "var(--danger-bg)" }}>
              <ul className="space-y-3">
                {RED_FLAGS.map((r, i) => <li key={i} className="text-sm flex gap-3" style={{ color: "#7a3229" }}><AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> {r}</li>)}
              </ul>
            </ClayCard>
          </div>
        )}

        {/* ── UNDERRATED ── */}
        {tab === "underrated" && (
          <div key="underrated" className="clay-pop">
            <SectionHead eyebrow="Beyond The Obvious" title="Underrated Exams & Low-Cost Scholarships" />
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
              {UNDERRATED.map((u) => (
                <ClayCard key={u.name}>
                  <div className="clay-h2 mb-1" style={{ fontSize: 16 }}>{u.name}</div>
                  <div className="clay-body-text mb-2" style={{ fontSize: 12.5 }}>{u.where}</div>
                  <p className="clay-body-text mb-3">{u.why}</p>
                  <a className="clay-link" href={`https://${u.link}`} target="_blank" rel="noreferrer">{u.link} <ExternalLink size={12} /></a>
                </ClayCard>
              ))}
            </div>
            <div className="clay-eyebrow mb-3">Fully / near-fully funded, free applications</div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
              {SCHOLARSHIPS.map((s) => (
                <ClayCard key={s.name} style={{ padding: 18 }}>
                  <div className="flex justify-between items-center mb-1"><span style={{ fontWeight: 700 }}>{s.name}</span><Chip bg="var(--gold-bg)" color="#4a3418">{s.region}</Chip></div>
                  <p className="clay-body-text">{s.note}</p>
                </ClayCard>
              ))}
            </div>
          </div>
        )}

        {/* ── TOOLKIT ── */}
        {tab === "toolkit" && (
          <div key="toolkit" className="clay-pop">
            <SectionHead eyebrow="Track It, Don't Just Read It" title="Registration Tracker & Fallback Paths" body="Session-only — your ticks won't survive a full reload, so note real progress elsewhere too." />
            <ClayCard className="mb-6">
              {starred.size > 0 ? (
                <>
                  <div className="clay-eyebrow mb-3" style={{ fontSize: 11 }}>Built from your starred exams</div>
                  <div className="space-y-2">
                    {[...starred, "Documents folder ready"].map((item) => (
                      <div key={item} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(item)}>
                        <div className={`clay-check ${checked.has(item) ? "on" : ""}`}>{checked.has(item) && <Check size={14} color="#1d3a22" />}</div>
                        <span style={{ textDecoration: checked.has(item) ? "line-through" : "none", opacity: checked.has(item) ? 0.6 : 1 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {["CUET UG", "Primary Science/Commerce/Arts exam", "Backup safety-net exam", "Documents folder ready"].map((item) => (
                      <div key={item} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(item)}>
                        <div className={`clay-check ${checked.has(item) ? "on" : ""}`}>{checked.has(item) && <Check size={14} color="#1d3a22" />}</div>
                        <span style={{ textDecoration: checked.has(item) ? "line-through" : "none", opacity: checked.has(item) ? 0.6 : 1 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="clay-body-text" style={{ fontSize: 12 }}>💡 Star exams on the Exams tab and this checklist rebuilds itself around your actual shortlist.</p>
                </>
              )}
            </ClayCard>
            <div className="clay-eyebrow mb-3">If this cycle doesn't work out</div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
              {FALLBACKS.map((f) => {
                const Icon = f.icon;
                return (
                  <ClayCard key={f.title}>
                    <Icon size={20} style={{ color: "var(--gold)", marginBottom: 8 }} />
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                    <p className="clay-body-text">{f.body}</p>
                  </ClayCard>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FREE PREP ── */}
        {tab === "freeprep" && (
          <div key="freeprep" className="clay-pop">
            <SectionHead eyebrow="No Coaching Fee Required" title="Zero-Cost Prep" body="Genuinely free channels & books for your stream." />
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
              {prepList.map((p) => (
                <ClayCard key={p.subj}>
                  <div className="clay-h2 mb-2" style={{ fontSize: 16 }}>{p.subj}</div>
                  <div className="clay-body-text mb-2">
                    <b style={{ color: "var(--ink)" }}>Free channels: </b>
                    {p.ch.split(',').map((channel, idx, arr) => (
                      <React.Fragment key={channel}>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(channel.trim() + " " + p.subj)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="clay-link"
                          style={{ textDecoration: 'underline', color: 'var(--sci)' }}
                        >
                          {channel.trim()}
                        </a>
                        {idx < arr.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="clay-body-text"><b style={{ color: "var(--ink)" }}>Books: </b>{p.bk}</p>
                </ClayCard>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {tab === "faq" && (
          <div key="faq" className="clay-pop">
            <SectionHead eyebrow="Quick Answers" title="Frequently Asked Questions" />
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <ClayCard key={i} style={{ padding: "18px 22px", cursor: "pointer" }}>
                  <div onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Info size={16} style={{ color: "var(--gold)", flexShrink: 0 }} /><span style={{ fontWeight: 600 }}>{f.q}</span></div>
                    <ChevronDown size={18} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--muted)" }} />
                  </div>
                  {openFaq === i && <p className="clay-body-text mt-3" style={{ paddingLeft: 29 }}>{f.a}</p>}
                </ClayCard>
              ))}
            </div>
          </div>
        )}

        {/* ── WELLBEING ── */}
        {tab === "wellbeing" && (
          <div key="wellbeing" className="clay-pop">
            <SectionHead eyebrow="This Matters As Much As The Syllabus" title="Exam Stress & Burnout" />
            <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
              <ClayCard style={{ background: "var(--com-bg)" }}>
                <div className="font-bold mb-3" style={{ color: "#1d3a22" }}>✓ Worth building in</div>
                <ul className="space-y-2 text-sm" style={{ color: "#1d3a22" }}>
                  <li>Fixed sleep hours — 7+ is not a luxury</li>
                  <li>One full off-block a week, guilt-free</li>
                  <li>Short breaks every 45–60 minutes</li>
                  <li>Daily movement, even a 20-min walk</li>
                </ul>
              </ClayCard>
              <ClayCard style={{ background: "var(--danger-bg)" }}>
                <div className="font-bold mb-3" style={{ color: "#7a3229" }}>✕ Quietly makes it worse</div>
                <ul className="space-y-2 text-sm" style={{ color: "#7a3229" }}>
                  <li>Comparing your hours to everyone else's</li>
                  <li>Treating one mock score as a verdict</li>
                  <li>Cutting sleep to "add" study hours</li>
                  <li>Isolating completely for months</li>
                </ul>
              </ClayCard>
            </div>
            <ClayCard style={{ background: "var(--gold-bg)" }}>
              <div className="flex items-center gap-2 font-bold mb-2" style={{ color: "#4a3418" }}><Phone size={16} /> Free, confidential support in India</div>
              <p className="text-sm" style={{ color: "#4a3418" }}><b>iCall</b> (TISS) — 9152987821, Mon–Sat 10am–8pm · <b>Vandrevala Foundation</b> — 1860-2662-345, 24×7. Free, and not just for crises — ordinary exam stress counts too.</p>
            </ClayCard>
          </div>
        )}

        {/* ── SALARY ── */}
        {tab === "salary" && (
          <div key="salary" className="clay-pop">
            <SectionHead eyebrow="Career Earnings" title="Starting Salary Comparison (LPA)" body={`Government college / institute data only. Showing ${filteredSalary.length} of ${SALARY_DATA.length} entries.`} />
            {stream !== "all" && (
              <div className="flex flex-wrap gap-2 mb-5">
                <Pill active={!salaryOnlyStream} onClick={() => setSalaryOnlyStream(false)}>All Streams ({SALARY_DATA.length})</Pill>
                <Pill active={salaryOnlyStream} tone={stream} onClick={() => setSalaryOnlyStream(true)}>{meta.label} Only</Pill>
              </div>
            )}
            <ClayCard style={{ padding: "28px 20px" }}>
              <ResponsiveContainer width="100%" height={Math.max(220, filteredSalary.length * 38)}>
                <BarChart data={filteredSalary} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 12, fill: "var(--ink)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 14, border: "none", boxShadow: "0 6px 20px rgba(120,105,160,.3)", fontFamily: "Outfit" }} formatter={(v) => [`₹${v} LPA`, "Salary"]} />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={22}>{filteredSalary.map((d, i) => <Cell key={i} fill={d.fill} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </ClayCard>
          </div>
        )}

        {/* ── PLAN ── */}
        {tab === "plan" && (
          <div key="plan" className="clay-pop">
            <SectionHead eyebrow="Action Plan" title="What You Should Do Right Now" body="A stream-neutral structure — swap in your own exam names wherever it says 'entrance exam'." />
            <div className="space-y-4">
              {PLAN_STEPS.map((s, i) => (
                <ClayCard key={i} className="flex gap-4 items-start">
                  <div className="clay-node flex-shrink-0" style={{ background: "var(--gold-bg)", color: "#4a3418", minWidth: 38, justifyContent: "center" }}>{i + 1}</div>
                  <div><div style={{ fontWeight: 700, marginBottom: 4 }}>{s.t}</div><p className="clay-body-text">{s.d}</p></div>
                </ClayCard>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-16" style={{ paddingBottom: 10 }}>
          <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 10, display: "inline-block" }}>❤️</div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.01em", marginBottom: 6 }}>
            Made by <span style={{ color: "var(--gold)" }}>Sachin</span>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
            Verified July 2026 · Covers Science, Commerce &amp; Arts · 55+ exams
            <br />Link updates as you navigate — bookmark or share it directly
          </div>
        </div>
      </div>
      
      {/* ── SCROLL TO TOP ── */}
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="clay-pop clay-btn-icon"
          title="Scroll to top"
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, width: 46, height: 46, borderRadius: 23, background: "var(--card)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
        >
          <ArrowUp size={22} style={{ color: "var(--ink)" }} />
        </button>
      )}
    </div>
  );
}
