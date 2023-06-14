import {partialStateForVerificationIssuesProducts} from '@/../.storybook/mock/product-feed';
import getters from './getters';
import {
  ProductVerificationIssue,
  State,
  state as originalState,
} from './state';

describe('Product Feed getters', () => {
  describe('Verification Issues Products', () => {
    it('returns null when the data does not exist', () => {
      const state: State = {
        ...originalState,
        verificationIssuesProducts: {},
      };

      const verificationIssue = ProductVerificationIssue.MISSING_IMAGE;
      const numberOfProducts: number = 10;
      const activePage: number = 0;

      const results = getters.GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS(
        state,
      )(verificationIssue, numberOfProducts, activePage);

      expect(results).toBeNull();
    });

    it('returns the first page', () => {
      const state: State = {
        ...originalState,
        verificationIssuesProducts:
          partialStateForVerificationIssuesProducts.verificationIssuesProducts,
      };

      const verificationIssue = ProductVerificationIssue.MISSING_DESCRIPTION;
      const numberOfProducts: number = 10;
      const activePage: number = 0;

      const results = getters.GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS(
        state,
      )(verificationIssue, numberOfProducts, activePage);

      expect(results).toEqual([
        {
          id: '7938',
          variationCount: '2',
          name: 'Ivysaur',
          langs: ['en', 'fr'],
        },
        {
          id: '7939',
          variationCount: '2',
          name: 'Venusaur',
          langs: ['en', 'fr'],
        },
        {
          id: '7941',
          variationCount: '2',
          name: 'Charmeleon',
          langs: ['en', 'fr'],
        },
        {
          id: '7944',
          variationCount: '2',
          name: 'Wartortle',
          langs: ['en', 'fr'],
        },
        {
          id: '7947',
          variationCount: '2',
          name: 'Metapod',
          langs: ['en', 'fr'],
        },
        {
          id: '7948', variationCount: '1', name: 'Butterfree', langs: ['en'],
        },
        {
          id: '7949',
          variationCount: '2',
          name: 'Weedle',
          langs: ['en', 'fr'],
        },
        {
          id: '7950',
          variationCount: '2',
          name: 'Kakuna',
          langs: ['en', 'fr'],
        },
        {
          id: '7951',
          variationCount: '2',
          name: 'Beedrill',
          langs: ['en', 'fr'],
        },
        {
          id: '7952',
          variationCount: '2',
          name: 'Pidgey',
          langs: ['en', 'fr'],
        },
      ]);
    });

    it('returns the fifth page of 5 elements', () => {
      const state: State = {
        ...originalState,
        verificationIssuesProducts:
          partialStateForVerificationIssuesProducts.verificationIssuesProducts,
      };

      const verificationIssue = ProductVerificationIssue.MISSING_DESCRIPTION;
      const numberOfProducts: number = 5;
      const activePage: number = 4;

      const results = getters.GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS(
        state,
      )(verificationIssue, numberOfProducts, activePage);

      expect(results).toEqual([
        {
          id: '7964',
          variationCount: '2',
          name: 'Sandslash',
          langs: ['en', 'fr'],
        },
        {
          id: '7965',
          variationCount: '2',
          name: 'Nidoran-f',
          langs: ['en', 'fr'],
        },
        {
          id: '7966',
          variationCount: '2',
          name: 'Nidorina',
          langs: ['en', 'fr'],
        },
        {
          id: '7967',
          variationCount: '2',
          name: 'Nidoqueen',
          langs: ['en', 'fr'],
        },
        {
          id: '7968',
          variationCount: '2',
          name: 'Nidoran-m',
          langs: ['en', 'fr'],
        },
      ]);
    });

    it('returns the third page of 15 elements', () => {
      const state: State = {
        ...originalState,
        verificationIssuesProducts:
          partialStateForVerificationIssuesProducts.verificationIssuesProducts,
      };

      const verificationIssue = ProductVerificationIssue.MISSING_DESCRIPTION;
      const numberOfProducts: number = 15;
      const activePage: number = 2;

      const results = getters.GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS(
        state,
      )(verificationIssue, numberOfProducts, activePage);

      expect(results).toEqual([
        {
          id: '7969',
          variationCount: '2',
          name: 'Nidorino',
          langs: ['en', 'fr'],
        },
        {
          id: '7970',
          variationCount: '2',
          name: 'Nidoking',
          langs: ['en', 'fr'],
        },
        {
          id: '7971',
          variationCount: '2',
          name: 'Clefairy',
          langs: ['en', 'fr'],
        },
        {
          id: '7972',
          variationCount: '2',
          name: 'Clefable',
          langs: ['en', 'fr'],
        },
        {
          id: '7973',
          variationCount: '2',
          name: 'Vulpix',
          langs: ['en', 'fr'],
        },
      ]);
    });
  });
});
