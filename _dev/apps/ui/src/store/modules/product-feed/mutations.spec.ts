import cloneDeep from "lodash.clonedeep";
import { partialStateForVerificationIssuesProducts } from "@/../.storybook/mock/product-feed";
import { ProductVerificationIssue, State, state as originalState } from "./state";
import mutations from "./mutations";

describe("Product Feed mutations", () => {
  describe('SAVE_VERIFICATION_ISSUE_PRODUCTS', () => {
    it('Creates the list and adds the new elements', () => {
      const state: State = {
        ...originalState,
        verificationIssuesProducts: {
          MISSING_LINK: [],
        }
      };

      mutations.SAVE_VERIFICATION_ISSUE_PRODUCTS(
        state,
        {
          originalPayload: {
            verificationIssue: ProductVerificationIssue.MISSING_PRICE,
            limit: 5,
            offset: 5,
          },
          verificationIssueProducts: [
            {
              id: "7974",
              variationCount: "2",
              name: "Another Clefable",
              langs: ["en", "fr"],
            },
            {
              id: "7975",
              variationCount: "2",
              name: "Another Vulpix",
              langs: ["en", "fr"],
            },
          ]
        }
      );

      expect(state.verificationIssuesProducts).toEqual({
        MISSING_LINK: [],
        MISSING_PRICE: [
          null,
          null,
          null,
          null,
          null,
          {
            id: "7974",
            variationCount: "2",
            name: "Another Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7975",
            variationCount: "2",
            name: "Another Vulpix",
            langs: ["en", "fr"],
          },
        ],
      });
    });

    it('Loads the next page and adds the new elements at the end of the list', () => {
      const state: State = {
        ...originalState,
        ...cloneDeep(partialStateForVerificationIssuesProducts)
      };

      mutations.SAVE_VERIFICATION_ISSUE_PRODUCTS(
        state,
        {
          originalPayload: {
            verificationIssue: ProductVerificationIssue.MISSING_DESCRIPTION,
            limit: 5,
            offset: 35,
          },
          verificationIssueProducts: [
            {
              id: "7974",
              variationCount: "2",
              name: "Another Clefable",
              langs: ["en", "fr"],
            },
            {
              id: "7975",
              variationCount: "2",
              name: "Another Vulpix",
              langs: ["en", "fr"],
            },
          ]
        }
      );

      expect(state.verificationIssuesProducts).toEqual({
        MISSING_DESCRIPTION: [
          // page 0
          { id: "7938", variationCount: "2", name: "Ivysaur", langs: ["en", "fr"] },
          {
            id: "7939",
            variationCount: "2",
            name: "Venusaur",
            langs: ["en", "fr"],
          },
          {
            id: "7941",
            variationCount: "2",
            name: "Charmeleon",
            langs: ["en", "fr"],
          },
          {
            id: "7944",
            variationCount: "2",
            name: "Wartortle",
            langs: ["en", "fr"],
          },
          { id: "7947", variationCount: "2", name: "Metapod", langs: ["en", "fr"] },
          // page 1
          { id: "7948", variationCount: "1", name: "Butterfree", langs: ["en"] },
          { id: "7949", variationCount: "2", name: "Weedle", langs: ["en", "fr"] },
          { id: "7950", variationCount: "2", name: "Kakuna", langs: ["en", "fr"] },
          {
            id: "7951",
            variationCount: "2",
            name: "Beedrill",
            langs: ["en", "fr"],
          },
          { id: "7952", variationCount: "2", name: "Pidgey", langs: ["en", "fr"] },
          // page 2
          {
            id: "7953",
            variationCount: "2",
            name: "Pidgeotto",
            langs: ["en", "fr"],
          },
          {
            id: "7954",
            variationCount: "2",
            name: "Pidgeot",
            langs: ["en", "fr"],
          },
          {
            id: "7955",
            variationCount: "2",
            name: "Rattata",
            langs: ["en", "fr"],
          },
          {
            id: "7956",
            variationCount: "2",
            name: "Raticate",
            langs: ["en", "fr"],
          },
          {
            id: "7957",
            variationCount: "2",
            name: "Spearow",
            langs: ["en", "fr"],
          },
          // page 3
          {
            id: "7958",
            variationCount: "2",
            name: "Fearow",
            langs: ["en", "fr"],
          },
          {
            id: "7959",
            variationCount: "2",
            name: "Ekans",
            langs: ["en", "fr"],
          },
          {
            id: "7960",
            variationCount: "2",
            name: "Arbok",
            langs: ["en", "fr"],
          },
          {
            id: "7962",
            variationCount: "2",
            name: "Raichu",
            langs: ["en", "fr"],
          },
          {
            id: "7963",
            variationCount: "2",
            name: "Sandshrew",
            langs: ["en", "fr"],
          },
          // page 4
          {
            id: "7964",
            variationCount: "2",
            name: "Sandslash",
            langs: ["en", "fr"],
          },
          {
            id: "7965",
            variationCount: "2",
            name: "Nidoran-f",
            langs: ["en", "fr"],
          },
          {
            id: "7966",
            variationCount: "2",
            name: "Nidorina",
            langs: ["en", "fr"],
          },
          {
            id: "7967",
            variationCount: "2",
            name: "Nidoqueen",
            langs: ["en", "fr"],
          },
          {
            id: "7968",
            variationCount: "2",
            name: "Nidoran-m",
            langs: ["en", "fr"],
          },
          // page 5
          {
            id: "7969",
            variationCount: "2",
            name: "Nidorino",
            langs: ["en", "fr"],
          },
          {
            id: "7970",
            variationCount: "2",
            name: "Nidoking",
            langs: ["en", "fr"],
          },
          {
            id: "7971",
            variationCount: "2",
            name: "Clefairy",
            langs: ["en", "fr"],
          },
          {
            id: "7972",
            variationCount: "2",
            name: "Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7973",
            variationCount: "2",
            name: "Vulpix",
            langs: ["en", "fr"],
          },
          // page 6
          {
            id: "7969",
            variationCount: "2",
            name: "Nidorino",
            langs: ["en", "fr"],
          },
          {
            id: "7970",
            variationCount: "2",
            name: "Nidoking",
            langs: ["en", "fr"],
          },
          {
            id: "7971",
            variationCount: "2",
            name: "Clefairy",
            langs: ["en", "fr"],
          },
          {
            id: "7972",
            variationCount: "2",
            name: "Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7973",
            variationCount: "2",
            name: "Vulpix",
            langs: ["en", "fr"],
          },
          {
            id: "7974",
            variationCount: "2",
            name: "Another Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7975",
            variationCount: "2",
            name: "Another Vulpix",
            langs: ["en", "fr"],
          },
        ],
      });
    });

    it('Reload the data of an existing page and alters the array properly', () => {
      const state: State = {
        ...originalState,
        ...cloneDeep(partialStateForVerificationIssuesProducts)
      };

      mutations.SAVE_VERIFICATION_ISSUE_PRODUCTS(
        state,
        {
          originalPayload: {
            verificationIssue: ProductVerificationIssue.MISSING_DESCRIPTION,
            limit: 2,
            offset: 10,
          },
          verificationIssueProducts: [
            {
              id: "7974",
              variationCount: "2",
              name: "Another Clefable",
              langs: ["en", "fr"],
            },
            {
              id: "7975",
              variationCount: "2",
              name: "Another Vulpix",
              langs: ["en", "fr"],
            },
          ]
        }
      );

      expect(state.verificationIssuesProducts).toEqual({
        MISSING_DESCRIPTION: [
          // page 0
          { id: "7938", variationCount: "2", name: "Ivysaur", langs: ["en", "fr"] },
          {
            id: "7939",
            variationCount: "2",
            name: "Venusaur",
            langs: ["en", "fr"],
          },
          {
            id: "7941",
            variationCount: "2",
            name: "Charmeleon",
            langs: ["en", "fr"],
          },
          {
            id: "7944",
            variationCount: "2",
            name: "Wartortle",
            langs: ["en", "fr"],
          },
          { id: "7947", variationCount: "2", name: "Metapod", langs: ["en", "fr"] },
          // page 1
          { id: "7948", variationCount: "1", name: "Butterfree", langs: ["en"] },
          { id: "7949", variationCount: "2", name: "Weedle", langs: ["en", "fr"] },
          { id: "7950", variationCount: "2", name: "Kakuna", langs: ["en", "fr"] },
          {
            id: "7951",
            variationCount: "2",
            name: "Beedrill",
            langs: ["en", "fr"],
          },
          { id: "7952", variationCount: "2", name: "Pidgey", langs: ["en", "fr"] },
          // page 2
          {
            id: "7974",
            variationCount: "2",
            name: "Another Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7975",
            variationCount: "2",
            name: "Another Vulpix",
            langs: ["en", "fr"],
          },
          {
            id: "7955",
            variationCount: "2",
            name: "Rattata",
            langs: ["en", "fr"],
          },
          {
            id: "7956",
            variationCount: "2",
            name: "Raticate",
            langs: ["en", "fr"],
          },
          {
            id: "7957",
            variationCount: "2",
            name: "Spearow",
            langs: ["en", "fr"],
          },
          // page 3
          {
            id: "7958",
            variationCount: "2",
            name: "Fearow",
            langs: ["en", "fr"],
          },
          {
            id: "7959",
            variationCount: "2",
            name: "Ekans",
            langs: ["en", "fr"],
          },
          {
            id: "7960",
            variationCount: "2",
            name: "Arbok",
            langs: ["en", "fr"],
          },
          {
            id: "7962",
            variationCount: "2",
            name: "Raichu",
            langs: ["en", "fr"],
          },
          {
            id: "7963",
            variationCount: "2",
            name: "Sandshrew",
            langs: ["en", "fr"],
          },
          // page 4
          {
            id: "7964",
            variationCount: "2",
            name: "Sandslash",
            langs: ["en", "fr"],
          },
          {
            id: "7965",
            variationCount: "2",
            name: "Nidoran-f",
            langs: ["en", "fr"],
          },
          {
            id: "7966",
            variationCount: "2",
            name: "Nidorina",
            langs: ["en", "fr"],
          },
          {
            id: "7967",
            variationCount: "2",
            name: "Nidoqueen",
            langs: ["en", "fr"],
          },
          {
            id: "7968",
            variationCount: "2",
            name: "Nidoran-m",
            langs: ["en", "fr"],
          },
          // page 5
          {
            id: "7969",
            variationCount: "2",
            name: "Nidorino",
            langs: ["en", "fr"],
          },
          {
            id: "7970",
            variationCount: "2",
            name: "Nidoking",
            langs: ["en", "fr"],
          },
          {
            id: "7971",
            variationCount: "2",
            name: "Clefairy",
            langs: ["en", "fr"],
          },
          {
            id: "7972",
            variationCount: "2",
            name: "Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7973",
            variationCount: "2",
            name: "Vulpix",
            langs: ["en", "fr"],
          },
          // page 6
          {
            id: "7969",
            variationCount: "2",
            name: "Nidorino",
            langs: ["en", "fr"],
          },
          {
            id: "7970",
            variationCount: "2",
            name: "Nidoking",
            langs: ["en", "fr"],
          },
          {
            id: "7971",
            variationCount: "2",
            name: "Clefairy",
            langs: ["en", "fr"],
          },
          {
            id: "7972",
            variationCount: "2",
            name: "Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7973",
            variationCount: "2",
            name: "Vulpix",
            langs: ["en", "fr"],
          },
        ],
      });
    });

    it('Loads the data of a page 2 directly and fills in the gap', () => {});
    const state: State = {
      ...originalState,
      verificationIssuesProducts: {
        MISSING_LINK: [],
      }
    };

    mutations.SAVE_VERIFICATION_ISSUE_PRODUCTS(
      state,
      {
        originalPayload: {
          verificationIssue: ProductVerificationIssue.MISSING_PRICE,
          limit: 2,
          offset: 2,
        },
        verificationIssueProducts: [
          {
            id: "7974",
            variationCount: "2",
            name: "Another Clefable",
            langs: ["en", "fr"],
          },
          {
            id: "7975",
            variationCount: "2",
            name: "Another Vulpix",
            langs: ["en", "fr"],
          },
        ]
      }
    );

    expect(state.verificationIssuesProducts).toEqual({
      MISSING_LINK: [],
      MISSING_PRICE: [
        null,
        null,
        {
          id: "7974",
          variationCount: "2",
          name: "Another Clefable",
          langs: ["en", "fr"],
        },
        {
          id: "7975",
          variationCount: "2",
          name: "Another Vulpix",
          langs: ["en", "fr"],
        },
      ],
    });
  });
});