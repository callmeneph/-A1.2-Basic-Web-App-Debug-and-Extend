<template>
  <div>
    <!-- Hero -->
    <section class="hero" aria-labelledby="heroTitle">
      <div class="container-xxl">
        <div class="row align-items-center g-5">
          <div class="col-12 col-lg-7">
            <span class="eyebrow">Community circular hub · Melbourne</span>
            <h1 id="heroTitle" class="hero-title">
              Give your waste a <span class="hero-accent">second life.</span>
            </h1>
            <p class="hero-lead">
              Find out what can be recycled, repaired or composted, see where to drop it off,
              and log your contribution to a greener Melbourne.
            </p>
            <div class="d-flex flex-wrap gap-2 mt-4">
              <a href="#directory" class="btn btn-success btn-lg">Search the directory</a>
              <router-link to="/map" class="btn btn-outline-secondary btn-lg">View drop-off map</router-link>
            </div>
          </div>

          <div class="col-12 col-lg-5">
            <div class="steps-card">
              <p class="steps-label">How it works</p>
              <ol class="steps">
                <li>
                  <span class="step-num">1</span>
                  <div>
                    <p class="step-title">Search an item</p>
                    <p class="step-copy">Look up batteries, soft plastics, food scraps and more.</p>
                  </div>
                </li>
                <li>
                  <span class="step-num">2</span>
                  <div>
                    <p class="step-title">Find a drop-off point</p>
                    <p class="step-copy">See which local hub accepts it and how much carbon you save.</p>
                  </div>
                </li>
                <li>
                  <span class="step-num">3</span>
                  <div>
                    <p class="step-title">Log your drop-off</p>
                    <p class="step-copy">Record what you brought in and track the community's impact.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <dl class="stats">
          <div class="stat">
            <dt>Materials listed</dt>
            <dd>{{ wasteData.length }}</dd>
          </div>
          <div class="stat">
            <dt>Drop-off points</dt>
            <dd>{{ locationCount }}</dd>
          </div>
          <div class="stat">
            <dt>Accepted now</dt>
            <dd>{{ acceptedCount }}</dd>
          </div>
          <div class="stat">
            <dt>CO₂e saved per round</dt>
            <dd>{{ totalSaving }}<span class="stat-unit">kg</span></dd>
          </div>
        </dl>
      </div>
    </section>

    <div class="container-xxl">
      <section id="directory" class="home-section" aria-label="Waste directory">
        <WasteDirectory />
      </section>
      <section id="log" class="home-section" aria-label="Log a drop-off">
        <DropOffForm />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import WasteDirectory from '../components/WasteDirectory.vue'
import DropOffForm from '../components/DropOffForm.vue'
import wasteData from '../assets/json/wasteData.json'

const locationCount = computed(() => new Set(wasteData.map((i) => i.dropOffLocation)).size)
const acceptedCount = computed(() => wasteData.filter((i) => i.accepted).length)
const totalSaving = computed(() =>
  wasteData.reduce((sum, i) => sum + i.carbonSavingKg, 0).toFixed(1)
)
</script>

<style scoped>
.hero {
  padding: 3.5rem 0 2.5rem;
  background:
    radial-gradient(60rem 24rem at 85% -10%, rgba(21, 128, 61, 0.08), transparent 60%),
    var(--eco-bg);
  border-bottom: 1px solid var(--eco-line);
  margin-bottom: 2.5rem;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 1.1rem 0 1rem;
}
.hero-accent { color: var(--eco-green); }

.hero-lead {
  font-size: 1.12rem;
  line-height: 1.6;
  color: var(--eco-muted);
  max-width: 36rem;
  margin: 0;
}

/* How-it-works card */
.steps-card {
  background: var(--eco-surface);
  border: 1px solid var(--eco-line);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: var(--eco-shadow-lg);
}
.steps-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--eco-muted);
  margin-bottom: 1rem;
}
.steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.1rem; }
.steps li { display: flex; gap: 0.9rem; align-items: flex-start; }
.step-num {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--eco-green-soft);
  color: var(--eco-green);
  font-weight: 650;
  font-size: 0.85rem;
}
.step-title { font-weight: 600; margin: 0 0 0.15rem; }
.step-copy { color: var(--eco-muted); font-size: 0.9rem; margin: 0; }

/* Stats strip */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 3rem 0 0;
  border: 1px solid var(--eco-line);
  border-radius: 16px;
  background: var(--eco-surface);
  overflow: hidden;
}
.stat { padding: 1.2rem 1.4rem; border-left: 1px solid var(--eco-line); }
.stat:first-child { border-left: 0; }
.stat dt { font-size: 0.82rem; font-weight: 500; color: var(--eco-muted); margin-bottom: 0.25rem; }
.stat dd { font-size: 1.75rem; font-weight: 650; letter-spacing: -0.03em; margin: 0; }
.stat-unit { font-size: 0.95rem; color: var(--eco-muted); font-weight: 500; margin-left: 0.2rem; }

@media (max-width: 767.98px) {
  .hero { padding-top: 2.25rem; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(3) { border-left: 0; }
  .stat:nth-child(n + 3) { border-top: 1px solid var(--eco-line); }
}

.home-section { scroll-margin-top: 90px; margin-bottom: 2rem; }
</style>
