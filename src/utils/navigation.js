// Navigation utility for role-based routing
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  ADMIN: '/admin',
  AGENT: '/agent',
  PROPERTIES: '/properties',
  AGENTS: '/agents',
  ABOUT: '/about',
  CONTACT: '/contact'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user'
};

export const getDashboardRoute = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN;
    case USER_ROLES.AGENT:
      return ROUTES.AGENT;
    case USER_ROLES.USER:
    default:
      return ROUTES.PROFILE;
  }
};

export const isAuthorized = (userRole, requiredRole) => {
  if (!requiredRole) return true;
  return userRole === requiredRole;
};
