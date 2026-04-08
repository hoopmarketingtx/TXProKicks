import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, MapPin, ExternalLink, Flame, ShoppingBag, Trophy, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PHOTO_MAIN =
  "https://bloximages.chicago2.vip.townnews.com/lufkindailynews.com/content/tncms/assets/v3/editorial/7/87/787fbcbc-b996-5beb-a190-486899c6de93/69ace7606cc4e.image.jpg?resize=990%2C660";
const PHOTO_SIDE =
  "https://bloximages.chicago2.vip.townnews.com/lufkindailynews.com/content/tncms/assets/v3/editorial/0/9d/09d511b5-c9b0-528f-80ce-27f967f57abc/69ace762122d7.image.jpg?resize=333%2C500";

const STATS = [
  { icon: ShoppingBag, value: "150+", label: "Pairs sold on day one" },
  { icon: Flame,       value: "19",   label: "Years old at opening" },
  { icon: Clock,       value: "100+", label: "Hours worked weekly" },
  { icon: Trophy,      value: "Est. 2020", label: "Founded" },
];

const QUOTES = [
  {
    text: "After we did those numbers, I realized, 'OK, I think it's time for me to level up.'",
    context: "On expanding from mobile store to permanent location",
  },
  {
    text: "The mobile store was the biggest switch in my business because it made it known that I'm not just a random kid — I'm a real-life business owner.",
    context: "On building credibility",
  },
  {
    text: "I told my teachers I was going to open up a sneaker store, and I'm going to be the youngest guy to do it.",
    context: "On fulfilling his freshman-year promise",
  },
  {
    text: "In five years, I see myself with multiple locations. I truly do believe I'll be the biggest sneaker company in Texas.",
    context: "On the future of TXProKicks",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] bg-black overflow-hidden flex items-end">
        {/* Full-bleed photo */}
        <img
          src={PHOTO_MAIN}
          alt="Joachim Gutierrez in front of sneakers"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-45"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {/* Text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-2xl space-y-5"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 36 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-[2px] bg-primary block flex-shrink-0"
              />
              <p className="font-body text-xs font-semibold tracking-[0.3em] text-primary uppercase">
                Our Story
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-6xl md:text-8xl leading-none text-white tracking-wide"
            >
              BUILT FROM THE<br />
              <span className="text-primary">GROUND UP</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-body text-base text-white/60 leading-relaxed max-w-lg">
              From selling shoes in high school hallways to opening East Texas's premier sneaker destination —
              the TXProKicks story is only getting started.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-red-900/40">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center"
              >
                <Icon className="w-5 h-5 text-white/50 mb-1" />
                <p className="font-heading text-3xl text-white leading-none">{value}</p>
                <p className="font-body text-[11px] text-white/60 tracking-[0.15em] uppercase">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — narrative */}
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="font-heading text-xs tracking-[0.25em] text-primary uppercase mb-3">The Beginning</p>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-wide leading-tight mb-5">
                A FRESHMAN WITH A PLAN
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  Joachim Gutierrez didn't wait for permission. As a freshman in high school, he was already
                  selling sneakers and telling anyone who would listen that he was going to open a store —
                  and that he'd be the youngest to do it.
                </p>
                <p>
                  That determination paid off. Less than a year after debuting a mobile sneaker store he built
                  from scratch, Gutierrez, 19, opened a permanent retail location at{" "}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=1008+East+Denman+Avenue+Lufkin+TX+75904"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    1008 E. Denman Ave., Lufkin <MapPin className="w-3.5 h-3.5" />
                  </a>
                  {" "}— bringing a retail sneaker experience to East Texas that used to require a trip to
                  Houston or Dallas.
                </p>
                <p>
                  The tipping point? His mobile store grand opening moved <strong className="text-foreground">more than 150 pairs in a single day.</strong>{" "}
                  That number made the decision easy.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="font-heading text-xs tracking-[0.25em] text-primary uppercase mb-3">The Grind</p>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-wide leading-tight mb-5">
                FIREFIGHTER BY DAY, <br />SNEAKER BOSS ALWAYS
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  Gutierrez doesn't just run TXProKicks — he also works three 24-hour shifts a week as a
                  firefighter. His days off are spent buying, selling, shipping, marketing, and answering
                  every message himself.
                </p>
                <p>
                  By his own estimate, his combined workload exceeds 100 hours a week. He's traded parties,
                  friend hangouts, and family time for the business. He says it's worth every sacrifice.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — photo + quotes */}
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative"
            >
              <img
                src={PHOTO_SIDE}
                alt="Joachim Gutierrez"
                className="w-full max-w-xs rounded-2xl object-cover shadow-2xl mx-auto lg:mx-0"
              />
              {/* Caption */}
              <p className="mt-3 font-body text-xs text-muted-foreground text-center lg:text-left">
                Joachim Gutierrez — Owner, TXProKicks &nbsp;·&nbsp;
                <a
                  href="https://lufkindailynews.com/news/local/teen-entrepreneur-brings-sneaker-business-to-permanent-lufkin-location/article_95b1381a-22ad-5bb1-a372-cfe245b30aee.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Photo: Lufkin Daily News
                </a>
              </p>
            </motion.div>

            {/* Pull quotes */}
            {QUOTES.slice(0, 2).map((q, i) => (
              <motion.blockquote
                key={i}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="border-l-2 border-primary pl-5 space-y-1"
              >
                <p className="font-body text-sm text-foreground leading-relaxed italic">"{q.text}"</p>
                <p className="font-body text-xs text-muted-foreground">{q.context}</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press mention ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col md:flex-row items-center justify-between gap-6 border border-border rounded-2xl p-8"
        >
          <div>
            <p className="font-heading text-xs tracking-[0.2em] text-primary uppercase mb-2">As Seen In</p>
            <p className="font-heading text-2xl text-foreground">The Lufkin Daily News</p>
            <p className="font-body text-sm text-muted-foreground mt-1">March 10, 2026 · By Ruben Ibarra Jr.</p>
            <p className="font-body text-sm text-muted-foreground mt-3 max-w-lg">
              "Teen entrepreneur brings sneaker business to permanent Lufkin location"
            </p>
          </div>
          <a
            href="https://lufkindailynews.com/news/local/teen-entrepreneur-brings-sneaker-business-to-permanent-lufkin-location/article_95b1381a-22ad-5bb1-a372-cfe245b30aee.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 font-body text-sm font-semibold text-primary border border-primary rounded-none px-6 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            Read Article <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-heading text-5xl md:text-6xl text-white tracking-wide"
          >
            COME SEE THE HEAT
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-body text-base text-white/70 max-w-md mx-auto"
          >
            Open 1–7 PM four days a week. Check our socials for current operating days.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/inventory">
              <button className="inline-flex items-center gap-2 font-heading tracking-[0.2em] text-base px-10 py-4 bg-white text-primary hover:bg-white/90 transition-colors">
                SHOP NOW <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a
              href="https://www.instagram.com/txprokicks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-heading tracking-[0.2em] text-base px-10 py-4 border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-5 h-5" /> FOLLOW US
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
