import { environment } from '../environment';
import AuthService from './AuthService';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  preferredLanguage?: 'fr' | 'ar' | 'en';
  dialect?: 'aqelei' | 'waryaghri';
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  skillId: string;
  level: number;
  experience: number;
  maxExperience: number;
  completedExercises: number;
  totalExercises: number;
  lastActivityDate: string;
  streak: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  unlockedAt: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
}

export interface UserStats {
  userId: string;
  totalExperience: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number; // in minutes
  skillsCompleted: number;
  totalSkills: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface LearningGoals {
  userId: string;
  dailyXPGoal: number;
  weeklyLessonsGoal: number;
  preferredStudyTime?: string;
  reminderEnabled: boolean;
  targetSkills: string[];
}

export interface StudySession {
  id: string;
  userId: string;
  skillId: string;
  startTime: string;
  endTime?: string;
  experienceGained: number;
  exercisesCompleted: number;
  accuracy: number;
}

class UserService {
  private baseUrl = environment.services.user.baseUrl;
  private endpoints = environment.services.user.endpoints;

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Profile Methods
  async getUserProfile(): Promise<UserProfile> {
    const url = `${this.baseUrl}${this.endpoints.profile}`;
    return this.makeRequest<UserProfile>(url);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const url = `${this.baseUrl}${this.endpoints.profile}`;
    return this.makeRequest<UserProfile>(url, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async deleteUserProfile(): Promise<void> {
    const url = `${this.baseUrl}${this.endpoints.profile}`;
    await this.makeRequest<void>(url, {
      method: 'DELETE',
    });
  }

  // Progress Methods
  async getUserProgress(skillId?: string): Promise<UserProgress[]> {
    const params = skillId ? `?skillId=${skillId}` : '';
    const url = `${this.baseUrl}${this.endpoints.progress}${params}`;
    return this.makeRequest<UserProgress[]>(url);
  }

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<UserProgress> {
    const url = `${this.baseUrl}${this.endpoints.progress}`;
    return this.makeRequest<UserProgress>(url, {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getProgressBySkill(skillId: string): Promise<UserProgress> {
    const url = `${this.baseUrl}${this.endpoints.progress}/${skillId}`;
    return this.makeRequest<UserProgress>(url);
  }

  // Achievement Methods
  async getUserAchievements(): Promise<UserAchievement[]> {
    const url = `${this.baseUrl}${this.endpoints.achievements}`;
    return this.makeRequest<UserAchievement[]>(url);
  }

  async unlockAchievement(achievementType: string): Promise<UserAchievement> {
    const url = `${this.baseUrl}${this.endpoints.achievements}`;
    return this.makeRequest<UserAchievement>(url, {
      method: 'POST',
      body: JSON.stringify({ achievementType }),
    });
  }

  async getAchievementById(achievementId: string): Promise<UserAchievement> {
    const url = `${this.baseUrl}${this.endpoints.achievements}/${achievementId}`;
    return this.makeRequest<UserAchievement>(url);
  }

  // Stats Methods
  async getUserStats(): Promise<UserStats> {
    const url = `${this.baseUrl}${this.endpoints.stats}`;
    return this.makeRequest<UserStats>(url);
  }

  async updateUserStats(statsData: Partial<UserStats>): Promise<UserStats> {
    const url = `${this.baseUrl}${this.endpoints.stats}`;
    return this.makeRequest<UserStats>(url, {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
  }

  // Learning Goals Methods
  async getLearningGoals(): Promise<LearningGoals> {
    const url = `${this.baseUrl}/api/user/goals`;
    return this.makeRequest<LearningGoals>(url);
  }

  async updateLearningGoals(goals: Partial<LearningGoals>): Promise<LearningGoals> {
    const url = `${this.baseUrl}/api/user/goals`;
    return this.makeRequest<LearningGoals>(url, {
      method: 'PUT',
      body: JSON.stringify(goals),
    });
  }

  // Study Session Methods
  async startStudySession(skillId: string): Promise<StudySession> {
    const url = `${this.baseUrl}/api/user/sessions`;
    return this.makeRequest<StudySession>(url, {
      method: 'POST',
      body: JSON.stringify({ skillId }),
    });
  }

  async endStudySession(
    sessionId: string, 
    experienceGained: number, 
    exercisesCompleted: number, 
    accuracy: number
  ): Promise<StudySession> {
    const url = `${this.baseUrl}/api/user/sessions/${sessionId}/end`;
    return this.makeRequest<StudySession>(url, {
      method: 'PUT',
      body: JSON.stringify({ 
        experienceGained, 
        exercisesCompleted, 
        accuracy 
      }),
    });
  }

  async getStudySessions(limit = 10): Promise<StudySession[]> {
    const url = `${this.baseUrl}/api/user/sessions?limit=${limit}`;
    return this.makeRequest<StudySession[]>(url);
  }

  // Utility Methods
  async addExperience(skillId: string, amount: number): Promise<UserProgress> {
    const url = `${this.baseUrl}${this.endpoints.progress}/${skillId}/experience`;
    return this.makeRequest<UserProgress>(url, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async updateStreak(): Promise<UserStats> {
    const url = `${this.baseUrl}${this.endpoints.stats}/streak`;
    return this.makeRequest<UserStats>(url, {
      method: 'POST',
    });
  }

  async resetStreak(): Promise<UserStats> {
    const url = `${this.baseUrl}${this.endpoints.stats}/streak`;
    return this.makeRequest<UserStats>(url, {
      method: 'DELETE',
    });
  }
}

export default new UserService();