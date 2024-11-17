export type GetAllPagesInput = {
	path: [language: string]
}

export type GetAllPagesData = {
	rootLayoutContent: {
		manifestoLinkTitle: string;
		tarotReadingLinkTitle: string;
		ogData: {
			property: string;
			content: string;
		}[];
	};
	indexPageContent: {
		title: string;
		description: string;
		headerTitle: Record<PropertyKey, any>;
		headerDescription: Record<PropertyKey, any>;
	};
	tarotReadingPageContent: {
		headerTitle: Record<PropertyKey, any>;
		pickedCardTitle: Record<PropertyKey, any>;
		formDescription: Record<PropertyKey, any>;
		cardDescriptionHeaderText: string;
		submitButtonLabel: string;
		cardBackImage: {
			dimentions: NonNullable<[width: number, height: number] | null>;
			srcSet: {
				placeholder: {
					src: string;
					width: 30;
				};
				'2xs': {
					src: string;
					width: 100;
				};
				xs: {
					src: string;
					width: 300;
				};
				sm: {
					src: string;
					width: 640;
				};
				md: {
					src: string;
					width: 768;
				};
				lg: {
					src: string;
					width: 1024;
				};
				xl: {
					src: string;
					width: 1280;
				};
				'2xl': {
					src: string;
					width: 1536;
				};
			};
		};
		pickNextCardButtonLabel: string;
	};
	manifestoPageContent: {
		header: Record<PropertyKey, any>;
		content: Record<PropertyKey, any>;
		headerImage: {
			dimentions: NonNullable<[width: number, height: number] | null>;
			srcSet: {
				placeholder: {
					src: string;
					width: 700;
				};
				'2xs': {
					src: string;
					width: 700;
				};
				xs: {
					src: string;
					width: 700;
				};
				sm: {
					src: string;
					width: 700;
				};
				md: {
					src: string;
					width: 700;
				};
				lg: {
					src: string;
					width: 700;
				};
				xl: {
					src: string;
					width: 700;
				};
				'2xl': {
					src: string;
					width: 700;
				};
			};
		};
		contentImage: {
			dimentions: NonNullable<[width: number, height: number] | null>;
			srcSet: {
				placeholder: {
					src: string;
					width: 30;
				};
				'2xs': {
					src: string;
					width: 100;
				};
				xs: {
					src: string;
					width: 300;
				};
				sm: {
					src: string;
					width: 640;
				};
				md: {
					src: string;
					width: 768;
				};
				lg: {
					src: string;
					width: 1024;
				};
				xl: {
					src: string;
					width: 1280;
				};
				'2xl': {
					src: string;
					width: 1536;
				};
			};
		};
	};
	aboutUsPageContent: {
		id: string;
		header: {
			teamTitle: string;
			pageTitle: string;
		};
		image: {
			dimentions: NonNullable<[width: number, height: number] | null>;
			srcSet: {
				placeholder: {
					src: string;
					width: 30;
				};
				'2xs': {
					src: string;
					width: 100;
				};
				xs: {
					src: string;
					width: 300;
				};
				sm: {
					src: string;
					width: 640;
				};
				md: {
					src: string;
					width: 768;
				};
				lg: {
					src: string;
					width: 1024;
				};
				xl: {
					src: string;
					width: 1280;
				};
				'2xl': {
					src: string;
					width: 1536;
				};
			};
		};
		social: {
			title: string;
			urlTitle: string;
			url: string;
		}[];
	};
}

export type GetCardByIdInput = {
	path: [language: string, id: string]
}
export type GetCardsSetInput = { path: [language: string] }

export type GetCardsSetData = [{
	id: string;
	regular: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	upsideDown: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	image: {
		dimentions: NonNullable<[width: number, height: number] | null>;
		srcSet: {
			placeholder: {
				src: string;
				width: 30;
			};
			'2xs': {
				src: string;
				width: 100;
			};
			xs: {
				src: string;
				width: 300;
			};
			sm: {
				src: string;
				width: 640;
			};
			md: {
				src: string;
				width: 768;
			};
			lg: {
				src: string;
				width: 1024;
			};
			xl: {
				src: string;
				width: 1280;
			};
			'2xl': {
				src: string;
				width: 1536;
			};
		};
	};
}, ...{
	id: string;
	regular: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	upsideDown: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	image: {
		dimentions: NonNullable<[width: number, height: number] | null>;
		srcSet: {
			placeholder: {
				src: string;
				width: 30;
			};
			'2xs': {
				src: string;
				width: 100;
			};
			xs: {
				src: string;
				width: 300;
			};
			sm: {
				src: string;
				width: 640;
			};
			md: {
				src: string;
				width: 768;
			};
			lg: {
				src: string;
				width: 1024;
			};
			xl: {
				src: string;
				width: 1280;
			};
			'2xl': {
				src: string;
				width: 1536;
			};
		};
	};
}[]]

export type GetCardByIdData = {
	id: string;
	regular: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	upsideDown: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	image: {
		dimentions: NonNullable<[width: number, height: number] | null>;
		srcSet: {
			placeholder: {
				src: string;
				width: 30;
			};
			'2xs': {
				src: string;
				width: 100;
			};
			xs: {
				src: string;
				width: 300;
			};
			sm: {
				src: string;
				width: 640;
			};
			md: {
				src: string;
				width: 768;
			};
			lg: {
				src: string;
				width: 1024;
			};
			xl: {
				src: string;
				width: 1280;
			};
			'2xl': {
				src: string;
				width: 1536;
			};
		};
	};
}

export type PrevPickedCards = Array<{
	id: string,
	upsideDown: boolean
}>

export type GetRandomCardInput = {
	method: 'POST',
	path: [language: string],
	body: { prevPickedCards: PrevPickedCards }
}

export type GetRandomCardData = {
	id: string;
	regular: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	upsideDown: {
		title: string;
		shortDescription: string;
		fullDescription: Record<PropertyKey, any>;
	};
	image: {
		dimentions: NonNullable<[width: number, height: number] | null>;
		srcSet: {
			placeholder: {
				src: string;
				width: 30;
			};
			'2xs': {
				src: string;
				width: 100;
			};
			xs: {
				src: string;
				width: 300;
			};
			sm: {
				src: string;
				width: 640;
			};
			md: {
				src: string;
				width: 768;
			};
			lg: {
				src: string;
				width: 1024;
			};
			xl: {
				src: string;
				width: 1280;
			};
			'2xl': {
				src: string;
				width: 1536;
			};
		};
	};
}

export type TarotCard = GetCardsSetData[0]

export type Router = {
	['get-all-pages']: {
		input: GetAllPagesInput,
		data: GetAllPagesData,
	},
	['get-cards-set']: { input: GetCardsSetInput, data: GetCardsSetData }
	['get-card-by-id']: { input: GetCardByIdInput, data: GetCardByIdData }
	['get-random-card']: { input: GetRandomCardInput, data: GetRandomCardData }
}
