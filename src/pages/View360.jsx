import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';

const SRC =
  'https://www.google.com/maps/embed?pb=!1m0!3m2!1sde!2sch!4v1445006983948!6m8!1m7!1sP6kLOot01zwAAAQn7zwjhw!2m2!1d47.37453646987169!2d8.54392890244003!3f352.81263854513867!4f-6.618032237865052!5f0.7820865974627469';

export default function View360() {
  return (
    <>
      <PageHero eyebrow="Kontakt" title="360° View">
        Schauen Sie sich vor Ihrem Besuch an der Niederdorfstrasse 40 um. Ziehen Sie das Bild mit der Maus oder dem Finger.
      </PageHero>
      <Section>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl">
            <iframe title="360°-Ansicht der Niederdorfstrasse 40 in Zürich" src={SRC} loading="lazy" allow="accelerometer; gyroscope; fullscreen" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full border-0 sm:aspect-[16/9]" />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
