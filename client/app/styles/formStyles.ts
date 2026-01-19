export const formStyles = {
  container: 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-md',
  containerLarge: 'max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md',
  heading: 'text-2xl font-bold mb-6 text-gray-900',
  subheading: 'text-lg font-semibold mb-4',
  headingXL: 'text-xl font-semibold text-gray-900 mb-4',
  headingLG: 'text-lg font-medium text-gray-900 mb-3',
  text: 'text-gray-600 mb-6',
  form: 'space-y-4',
  formSection: 'space-y-6',
  sectionBorder: 'border-b pb-6',
  divider: 'border-t border-gray-200 pt-6',

  label: 'block text-sm font-medium text-gray-700 mb-1',
  input:
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',
  inputDisabled:
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed',
  inputWithPlaceholder:
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400',
  select:
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white',

  button:
    'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonPrimary:
    'w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSuccess:
    'w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSecondary:
    'inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
  buttonLink:
    'w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out',

  checkbox: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
  checkboxLabel: 'ml-2 block text-sm text-gray-900',
  checkboxWrapper: 'flex items-center',
  helpText: 'text-sm text-gray-500 mt-1',
  infoBox: 'bg-blue-50 border-l-4 border-blue-400 p-4',
  infoBoxContent: 'flex',
  infoBoxIcon: 'flex-shrink-0',
  infoBoxIconSvg: 'h-5 w-5 text-blue-400',
  infoBoxText: 'ml-3',
  infoBoxMessage: 'text-sm text-blue-700',
  colSpan2: 'md:col-span-2',

  grid: {
    single: 'grid grid-cols-1 gap-4',
    double: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    triple: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  },

  error: 'text-red-600 text-sm mt-1',
  success: {
    container: 'text-center',
    iconWrapper:
      'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4',
    icon: 'h-6 w-6 text-green-600',
    heading: 'text-2xl font-bold mb-4 text-gray-900',
    text: 'text-gray-600 mb-6',
  },
}

export const layoutStyles = {
  page: 'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8',
  header: {
    wrapper: 'sm:mx-auto sm:w-full sm:max-w-md',
    title: 'text-center text-3xl font-bold tracking-tight text-gray-900',
    subtitle: 'mt-2 text-center text-lg text-gray-600',
  },
  content: 'mt-8 sm:mx-auto sm:w-full sm:max-w-md',
  card: 'bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10',
  list: {
    container: 'space-y-2 text-sm text-gray-600',
    item: 'flex items-start',
    number: 'text-blue-600 mr-2',
  },
}
