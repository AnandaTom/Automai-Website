/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Language = 'fr' | 'en';

export interface Content {
  nav: {
    services: string;
    results: string;
    about: string;
    cta: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  socialProof: {
    stats: {
      revenue: string;
      revenueLabel: string;
      time: string;
      timeLabel: string;
      appointments: string;
      appointmentsLabel: string;
      growth: string;
      growthLabel: string;
    };
    testimonials: Array<{
      stars: number;
      project: string;
      quote: string;
      date: string;
    }>;
    badge: string;
    certification: string;
    toolsTitle: string;
    moreIntegrations: string;
  };
  caseStudies: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      result: string;
      description: string[];
      tags: string[];
    }>;
  };
  services: {
    title: string;
    cta: string;
    morePossibilities: string;
    items: Array<{
      title: string;
      desc: string;
      icon: string;
    }>;
  };
  about: {
    title: string;
    text: string[];
    philosophy: string[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
  };
  footer: {
    rights: string;
    legal: string;
  };
}