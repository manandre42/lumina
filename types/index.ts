
export interface User {
  id: string;
  name: string;
  interests: string[];
  avatarUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: string;
  source?: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isUserCreated?: boolean;
  audioBase64?: string | null;
  isLoadingAudio?: boolean;
  referencedLesson?: {
    id: string;
    title: string;
    author: string;
  };
}

export type ViewState = 'onboarding' | 'feed' | 'profile';

export const INTERESTS_LIST = [
  'Filosofia', 'Tecnologia', 'História', 'Psicologia', 
  'Ciência', 'Negócios', 'Arte', 'Saúde', 'Literatura'
];

export const MOCK_USER: User = {
  id: 'user_1',
  name: 'Alex Silva',
  interests: [],
  avatarUrl: 'https://picsum.photos/seed/user1/200'
};
