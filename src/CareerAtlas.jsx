import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Compass, GraduationCap, Briefcase, Palette, Sparkles, Search,
  FlaskConical, CalendarDays, Info, ChevronDown, ExternalLink,
  Check, X, Sun, Moon, MapPin, Wallet, ListChecks, HelpCircle,
  ShieldAlert, Landmark, Gem, Wrench, BookOpen, HeartHandshake,
  Star, Phone, AlertTriangle, FileText, Wind, Scale, Copy, RotateCcw,
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
  { name: "NATA / JEE Paper 2", stream: "science", subj: "PCM", reqMaths: true, reqBio: false, gets: "B.Arch — architecture colleges", difficulty: "Moderate", fees: "₹2–5L (5yr)", salary: "₹6–12 LPA", tag: "", month: "Apr 2027", when: "Apr–Jul", fmtMode: "CBT + offline Drawing Test", fmtQs: "Aptitude MCQs + 2 drawing Qs", cutoff: "80+/200 for a decent B.Arch seat", fmtExtra: "Hand-drawn spatial test — outside any PCMB subject", link: "nata.in", colleges: "SPA Delhi, govt architecture colleges" },
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
  { name: "CUET UG", stream: "all", subj: "Any", reqMaths: false, reqBio: false, gets: "250+ universities, any domain", difficulty: "Easy-Mod", fees: "₹5K–90K/yr", salary: "₹4–10 LPA", tag: "🛟", month: "May 2027", when: "May–June", fmtMode: "CBT · ~60 min/paper", fmtQs: "50 Qs/paper · +5/−1", cutoff: "80+ percentile for top DU colleges", fmtExtra: "General Test — reasoning + GK", link: "cuet.nta.nic.in", colleges: "DU, BHU, JNU, AMU + 250 more" },
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
];

const UNDERRATED = [
  { name: "ISI Admission Test", where: "Indian Statistical Institute, Kolkata", why: "India's top Maths/Stats institute — tiny applicant pool vs JEE/NEET, low fees, runs its own quiet entrance.", link: "admission.isical.ac.in" },
  { name: "CMI Entrance", where: "Chennai Mathematical Institute", why: "Elite, research-mentored, almost unknown outside Olympiad circles. Strong Olympiad rank can waive the test.", link: "cmi.ac.in" },
  { name: "AMU Engineering Entrance", where: "Aligarh Muslim University", why: "A central-university B.Tech most students forget to apply for since it isn't via JEE or CUET.", link: "amucontrollerexams.com" },
  { name: "AFMC (via NEET)", where: "Armed Forces Medical College, Pune", why: "Same NEET score, but leads to an MBBS plus guaranteed officer commission in the Armed Forces.", link: "afmc.nic.in" },
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
];

const MONTH_ORDER = ["Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027", "Aug 2027", "Dec 2027"];
const MONTH_EXTRAS = {
  "Feb 2027": ["State CET registration windows open (MHT-CET/KCET/KEAM/EAMCET/COMEDK)"],
  "Jul 2027": ["JoSAA rounds 1–5 begin", "NEET & WBJEE counselling begins", "State Pharmacy CET counselling"],
  "Aug 2027": ["CSAB special rounds", "IISER/NISER counselling", "Most college sessions begin"],
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
  { t: "CSAB", d: "Fills leftover NIT+ seats after JoSAA, needs fresh registration" },
  { t: "AIQ", d: "All India Quota — 15% of NEET govt seats open to all states" },
  { t: "TFW", d: "Tuition Fee Waiver scheme for low-income students" },
  { t: "GFTI", d: "Government Funded Technical Institute, beyond IIT/NIT/IIIT" },
  { t: "Spot round", d: "Final, fast counselling round to fill last vacant seats" },
  { t: "Non-creamy layer", d: "OBC sub-status based on family income, needed for OBC-NCL" },
  { t: "Home state", d: "The state whose quota you're eligible for at NITs" },
];

const DOCS = ["Class 10 & 12 mark sheets + admit cards", "Aadhaar card", "Category certificate (SC/ST/OBC-NCL)", "Income certificate", "Domicile certificate", "Passport photos + signature scans", "Bank account in your own name"];

const RED_FLAGS = [
  "Management-quota seats sold outside official counselling",
  "Deemed universities calling themselves \"NIT/IIT-affiliated\"",
  "\"100% rank guarantee\" coaching ads",
  "Pressure to pay non-refundable seat-blocking fees in 24 hrs",
  "Colleges without valid AICTE/UGC/NMC approval for that year",
  "Scholarship \"consultants\" charging large upfront fees",
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
];

const PLAN_STEPS = [
  { t: "Right Now — Lock the Syllabus", d: "Whatever your stream, board syllabus completion comes first — it underwrites 70–80% of every entrance exam on this app." },
  { t: "This Year — Register Widely", d: "Prep overlaps heavily within a stream. Sit for every exam that shares your syllabus — more attempts, more safety nets." },
  { t: "Know Your Financial Aid", d: "NISER pays a stipend. IIT/NIT waive fees under ₹5–9L income. Central universities charge as little as ₹5,000/yr." },
  { t: "Keep A Realistic Scenario Map", d: "Every outcome on this app — top choice or fifth choice — leads somewhere genuinely good. No single exam decides your future." },
];

const TABS = [
  { id: "home", label: "Exams", icon: ListChecks },
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

export default function CareerAtlas() {
  const initial = useMemo(parseHash, []);
  const [stream, setStream] = useState(initial.stream);
  const [tab, setTab] = useState(initial.tab);
  const [subjFilter, setSubjFilter] = useState("all"); // all | nomaths | nobio
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [dark, setDark] = useState(false);
  const [starred, setStarred] = useState(() => new Set());
  const [checked, setChecked] = useState(() => new Set());
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());
  const [showOnboarding, setShowOnboarding] = useState(() => !window.location.hash);

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

  const prepList = FREE_PREP[stream] || FREE_PREP.all;
  const meta = STREAM_META[stream];

  return (
    <div className={`clay-root ${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

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

        .clay-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 999px; text-decoration: none; background: #3d3557; color: #f6f1fc !important; }

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
          <div className="clay-node clay-header-badge" style={{ background: "var(--card)" }}>
            <Sparkles size={14} /> Career Atlas<span className="badge-suffix"> · Class 12, All Streams</span>
          </div>
          <div className="flex gap-2">
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={() => setOnlyStarred((v) => !v)} title="Show starred only" style={onlyStarred ? { background: "var(--gold)" } : {}}>
                <Star size={17} fill={onlyStarred ? "#4a3418" : "none"} />
              </button>
            )}
            {starred.size > 0 && (
              <button className="clay-btn-icon" onClick={copyShortlist} title="Copy starred list">
                {copied ? <Check size={17} color="var(--com)" /> : <Copy size={17} />}
              </button>
            )}
            <button className="clay-btn-icon" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

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
                        <span className="clay-link">{e.link} <ExternalLink size={12} /></span>
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
                        <span className="clay-link mt-1">{e.link} <ExternalLink size={12} /></span>
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
                        <span className="clay-link" style={{ fontSize: 11 }}>{e.link} <ExternalLink size={11} /></span>
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
                  <span className="clay-link">{u.link} <ExternalLink size={12} /></span>
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
                  <p className="clay-body-text mb-2"><b style={{ color: "var(--ink)" }}>Free channels: </b>{p.ch}</p>
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

        <div className="text-center mt-14" style={{ color: "var(--muted)", fontSize: 12 }}>
          Made by Sachin · Verified July 2026 · Link updates as you navigate — bookmark or share it directly
        </div>
      </div>
    </div>
  );
}
