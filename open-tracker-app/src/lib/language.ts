export type SupportedLanguage = keyof typeof languages;

export const languages = {
	en: {
		name: 'English',
		locale: 'en-US',
	},
	cs: {
		name: 'Čeština',
		locale: 'cs-CZ',
	},
} as const;

export const defaultLanguage: SupportedLanguage = 'en';
export const defaultLocale = languages[defaultLanguage].locale;

export function getLocaleByLanguage(language: SupportedLanguage): string {
	return languages[language].locale;
}

export const GetLanguages = () => {
	return Object.entries(languages).map(([key, value]) => ({
		code: key,
		name: value.name,
	}));
};
