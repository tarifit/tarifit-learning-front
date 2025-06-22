import { environment } from '../environment';
import AuthService from './AuthService';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  level: number;
  totalExperience: number;
  requiredExperience: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  dependencies: SkillDependency[];
  exercises: Exercise[];
  iconUrl?: string;
  color?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  color?: string;
  iconUrl?: string;
}

export interface SkillDependency {
  id: string;
  skillId: string;
  dependentSkillId: string;
  requiredLevel?: number;
  isRequired: boolean;
}

export interface Exercise {
  id: string;
  skillId: string;
  type: ExerciseType;
  title: string;
  instruction: string;
  content: ExerciseContent;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  experienceReward: number;
  timeLimit?: number;
  order: number;
  isActive: boolean;
}

export interface ExerciseType {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

export interface ExerciseContent {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  hints?: string[];
  mediaReferences?: MediaReference[];
}

export interface MediaReference {
  id: string;
  type: 'AUDIO' | 'IMAGE' | 'VIDEO';
  url: string;
  description?: string;
  duration?: number;
}

export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: number;
  experienceGained: number;
  hintsUsed: number;
}

export interface SkillProgress {
  skillId: string;
  currentLevel: number;
  currentExperience: number;
  requiredExperience: number;
  completedExercises: Exercise[];
  nextExercise?: Exercise;
  progressPercentage: number;
}

class LearningService {
  private baseUrl = environment.services.learning.baseUrl;
  private endpoints = environment.services.learning.endpoints;

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

  // Skill Methods
  async getAllSkills(): Promise<Skill[]> {
    const url = `${this.baseUrl}${this.endpoints.skills}`;
    return this.makeRequest<Skill[]>(url);
  }

  async getSkillById(skillId: string): Promise<Skill> {
    const url = `${this.baseUrl}${this.endpoints.skills}/${skillId}`;
    return this.makeRequest<Skill>(url);
  }

  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    const url = `${this.baseUrl}${this.endpoints.skills}?categoryId=${categoryId}`;
    return this.makeRequest<Skill[]>(url);
  }

  async getUnlockedSkills(): Promise<Skill[]> {
    const url = `${this.baseUrl}${this.endpoints.skills}?unlocked=true`;
    return this.makeRequest<Skill[]>(url);
  }

  async getSkillProgress(skillId: string): Promise<SkillProgress> {
    const url = `${this.baseUrl}${this.endpoints.skills}/${skillId}/progress`;
    return this.makeRequest<SkillProgress>(url);
  }

  async checkSkillUnlock(skillId: string): Promise<{ canUnlock: boolean; missingRequirements: string[] }> {
    const url = `${this.baseUrl}${this.endpoints.skills}/${skillId}/unlock-check`;
    return this.makeRequest(url);
  }

  // Exercise Methods
  async getAllExercises(): Promise<Exercise[]> {
    const url = `${this.baseUrl}${this.endpoints.exercises}`;
    return this.makeRequest<Exercise[]>(url);
  }

  async getExerciseById(exerciseId: string): Promise<Exercise> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${exerciseId}`;
    return this.makeRequest<Exercise>(url);
  }

  async getExercisesBySkill(skillId: string): Promise<Exercise[]> {
    const url = `${this.baseUrl}${this.endpoints.exercises}?skillId=${skillId}`;
    return this.makeRequest<Exercise[]>(url);
  }

  async getNextExercise(skillId: string): Promise<Exercise | null> {
    const url = `${this.baseUrl}${this.endpoints.skills}/${skillId}/next-exercise`;
    try {
      return await this.makeRequest<Exercise>(url);
    } catch (error) {
      // If no next exercise is available, return null
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async submitExerciseResult(result: ExerciseResult): Promise<{
    success: boolean;
    experienceGained: number;
    levelUp?: boolean;
    newLevel?: number;
    skillUnlocked?: Skill;
  }> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${result.exerciseId}/submit`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async validateExerciseAnswer(exerciseId: string, answer: string): Promise<{
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${exerciseId}/validate`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    });
  }

  // Exercise Type Methods
  async getExerciseTypes(): Promise<ExerciseType[]> {
    const url = `${this.baseUrl}/api/exercise-types`;
    return this.makeRequest<ExerciseType[]>(url);
  }

  async getExercisesByType(typeId: string): Promise<Exercise[]> {
    const url = `${this.baseUrl}${this.endpoints.exercises}?typeId=${typeId}`;
    return this.makeRequest<Exercise[]>(url);
  }

  // Skill Category Methods
  async getSkillCategories(): Promise<SkillCategory[]> {
    const url = `${this.baseUrl}/api/skill-categories`;
    return this.makeRequest<SkillCategory[]>(url);
  }

  async getSkillCategoryById(categoryId: string): Promise<SkillCategory> {
    const url = `${this.baseUrl}/api/skill-categories/${categoryId}`;
    return this.makeRequest<SkillCategory>(url);
  }

  // Media Methods
  async getMediaReference(mediaId: string): Promise<MediaReference> {
    const url = `${this.baseUrl}/api/media/${mediaId}`;
    return this.makeRequest<MediaReference>(url);
  }

  async getMediaByExercise(exerciseId: string): Promise<MediaReference[]> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${exerciseId}/media`;
    return this.makeRequest<MediaReference[]>(url);
  }

  // Learning Path Methods
  async getRecommendedSkills(): Promise<Skill[]> {
    const url = `${this.baseUrl}${this.endpoints.skills}/recommended`;
    return this.makeRequest<Skill[]>(url);
  }

  async getLearningPath(): Promise<{
    currentSkill: Skill;
    nextSkills: Skill[];
    completedSkills: Skill[];
    totalProgress: number;
  }> {
    const url = `${this.baseUrl}/api/learning-path`;
    return this.makeRequest(url);
  }

  // Achievement-related methods
  async checkForAchievements(): Promise<{
    newAchievements: string[];
    progressUpdates: Record<string, number>;
  }> {
    const url = `${this.baseUrl}/api/achievements/check`;
    return this.makeRequest(url, {
      method: 'POST',
    });
  }

  // Utility Methods
  async generateExerciseHint(exerciseId: string): Promise<{ hint: string; penaltyApplied: boolean }> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${exerciseId}/hint`;
    return this.makeRequest(url, {
      method: 'POST',
    });
  }

  async reportExerciseIssue(exerciseId: string, issue: string): Promise<void> {
    const url = `${this.baseUrl}${this.endpoints.exercises}/${exerciseId}/report`;
    await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify({ issue }),
    });
  }
}

export default new LearningService();