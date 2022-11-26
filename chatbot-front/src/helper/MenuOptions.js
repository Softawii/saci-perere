import { h } from 'vue';
import { NIcon } from 'naive-ui';
import {
  PersonAdd as PersonAddIcon,
  PeopleOutline as PeopleIcon,
  Newspaper as NewspaperIcon,
  Help as HelpIcon,
  LogOutOutline as LogOutOutIcon,
  PersonOutline as PersonIcon,
  ChatboxEllipsesOutline as ChatboxIcon,
  Document as DocumentIcon,
  StatsChart as ChartIcon,
  BookOutline as BookIcon,
  DownloadOutline as DownloadIcon,
} from '@vicons/ionicons5';
import { useUserStore } from '../store/UserStore';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function navOptions(enableIcon = true) {
  const userStore = useUserStore();
  return [
    {
      label: 'Tópicos',
      key: 'topics',
      href: '/topics',
      ...(enableIcon && { icon: renderIcon(ChatboxIcon) }),
    },
    {
      label: 'Categorias',
      key: 'topic',
      href: '/topic',
      ...(enableIcon && { icon: renderIcon(NewspaperIcon) }),
      disabled: true,
    },
    {
      label: 'QA',
      key: 'category',
      href: '/category',
      ...(enableIcon && { icon: renderIcon(DocumentIcon) }),
      disabled: true,
    },
    {
      label: 'Usuários',
      key: 'users',
      href: '/users',
      ...(enableIcon && { icon: renderIcon(PeopleIcon) }),
    },
    {
      label: 'Cadastrar Usuário',
      key: 'new-user',
      href: '/users',
      disabled: !userStore.profile.isadmin,
      ...(enableIcon && { icon: renderIcon(PersonAddIcon) }),
    },
    {
      label: 'Perguntas não respondidas',
      key: 'unknown-questions',
      href: '/unknown-questions',
      ...(enableIcon && { icon: renderIcon(HelpIcon) }),
    },
    {
      label: 'Estatísticas',
      key: 'stats',
      href: '/stats',
      ...(enableIcon && { icon: renderIcon(ChartIcon) }),
    },
    {
      label: 'Histórico',
      key: 'history',
      href: '/history',
      ...(enableIcon && { icon: renderIcon(BookIcon) }),
    },
  ];
}

const navUserMenuOptions = [
  {
    label: 'Perfil',
    key: 'edit-profile',
    icon: renderIcon(PersonIcon),
  },
  {
    label: () => h(
      'a',
      {
        href: `${import.meta.env.VITE_API_URL}/report/full?download=true`,
        target: '_blank',
        rel: 'noopenner noreferrer',
      },
      'Baixar Relatório',
    ),
    key: 'full-report',
    icon: renderIcon(DownloadIcon),
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogOutOutIcon),
  },
];

export default {
  navOptions,
  navUserMenuOptions,
};
