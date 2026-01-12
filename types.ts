

export interface Workshop {
  id: string;
  title: string;
  topicSeries: string;
  description: string;
  ageGroup: string;
  gradeLevel: number;
  duration: string;
  image: string;
  category: 'Physics' | 'Chemistry' | 'Biology' | 'Robotics' | 'Electronics' | 'Forensics' | 'Astronomy' | 'Applied Math';
  price: string;
  experimentCount: number;
  experimentList: string[];
  comingSoon?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export enum NavSection {
  HOME = 'home',
  WORKSHOPS = 'workshops',
  AI_LAB = 'ai-lab',
  CONTACT = 'contact',
}