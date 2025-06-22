export const environment = {
  production: false,
  services: {
    auth: {
      baseUrl: 'http://localhost:8081',
      endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register', 
        validate: '/api/auth/validate',
        refresh: '/api/auth/refresh'
      }
    },
    content: {
      baseUrl: 'http://localhost:8082',
      endpoints: {
        dictionary: {
          aqelei: '/api/dictionary/aqelei',
          waryaghri: '/api/dictionary/waryaghri',
          search: '/api/dictionary/search'
        },
        sentences: '/api/sentences',
        stories: '/api/stories',
        verbs: '/api/verbs',
        health: '/api/health'
      }
    },
    user: {
      baseUrl: 'http://localhost:8083',
      endpoints: {
        profile: '/api/user/profile',
        progress: '/api/user/progress',
        achievements: '/api/user/achievements',
        stats: '/api/user/stats'
      }
    },
    learning: {
      baseUrl: 'http://localhost:8084',
      endpoints: {
        skills: '/api/skills',
        exercises: '/api/exercises'
      }
    }
  }
};

export const environmentProd = {
  production: true,
  services: {
    auth: {
      baseUrl: process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8081',
      endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        validate: '/api/auth/validate', 
        refresh: '/api/auth/refresh'
      }
    },
    content: {
      baseUrl: process.env.REACT_APP_CONTENT_SERVICE_URL || 'http://localhost:8082',
      endpoints: {
        dictionary: {
          aqelei: '/api/dictionary/aqelei',
          waryaghri: '/api/dictionary/waryaghri', 
          search: '/api/dictionary/search'
        },
        sentences: '/api/sentences',
        stories: '/api/stories',
        verbs: '/api/verbs',
        health: '/api/health'
      }
    },
    user: {
      baseUrl: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8083',
      endpoints: {
        profile: '/api/user/profile',
        progress: '/api/user/progress',
        achievements: '/api/user/achievements',
        stats: '/api/user/stats'
      }
    },
    learning: {
      baseUrl: process.env.REACT_APP_LEARNING_SERVICE_URL || 'http://localhost:8084',
      endpoints: {
        skills: '/api/skills',
        exercises: '/api/exercises'
      }
    }
  }
};