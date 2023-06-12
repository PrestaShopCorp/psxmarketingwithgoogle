import { rest } from "msw";

import NonCompliantProductsDetailsPage from "@/components/product-feed-page/non-compliant-products-details-page/non-compliant-products-details-page.vue";

export default {
  title: "Product-Feed-Page/Non compliant products details Page",
  component: NonCompliantProductsDetailsPage,
};
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NonCompliantProductsDetailsPage },
  template: '<NonCompliantProductsDetailsPage ref="page" v-bind="$props" />',
  ...(args.mounted ? { mounted: args.mounted } : {}),
});

export const Default: any = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        `product-feeds/verification/issues/*/products?*`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              products: [
                {
                  id: "8047",
                  variationCount: "2",
                  name: "Rhyhorn",
                  langs: ["en", "fr"],
                },
                {
                  id: "8048",
                  variationCount: "2",
                  name: "Rhydon",
                  langs: ["en", "fr"],
                },
                {
                  id: "8049",
                  variationCount: "2",
                  name: "Chansey",
                  langs: ["en", "fr"],
                },
                {
                  id: "8050",
                  variationCount: "2",
                  name: "Tangela",
                  langs: ["en", "fr"],
                },
                {
                  id: "8051",
                  variationCount: "2",
                  name: "Kangaskhan",
                  langs: ["en", "fr"],
                },
                {
                  id: "8052",
                  variationCount: "2",
                  name: "Horsea",
                  langs: ["en", "fr"],
                },
                {
                  id: "8053",
                  variationCount: "2",
                  name: "Seadra",
                  langs: ["en", "fr"],
                },
                {
                  id: "8054",
                  variationCount: "2",
                  name: "Goldeen",
                  langs: ["en", "fr"],
                },
                {
                  id: "8055",
                  variationCount: "2",
                  name: "Seaking",
                  langs: ["en", "fr"],
                },
                {
                  id: "8056",
                  variationCount: "2",
                  name: "Staryu",
                  langs: ["en", "fr"],
                },
                {
                  id: "8057",
                  variationCount: "2",
                  name: "Starmie",
                  langs: ["en", "fr"],
                },
                {
                  id: "8058",
                  variationCount: "2",
                  name: "Mr-mime",
                  langs: ["en", "fr"],
                },
                {
                  id: "8059",
                  variationCount: "2",
                  name: "Scyther",
                  langs: ["en", "fr"],
                },
                {
                  id: "8060",
                  variationCount: "2",
                  name: "Jynx",
                  langs: ["en", "fr"],
                },
                {
                  id: "8061",
                  variationCount: "2",
                  name: "Electabuzz",
                  langs: ["en", "fr"],
                },
                {
                  id: "8062",
                  variationCount: "2",
                  name: "Magmar",
                  langs: ["en", "fr"],
                },
                {
                  id: "8063",
                  variationCount: "2",
                  name: "Pinsir",
                  langs: ["en", "fr"],
                },
                {
                  id: "8064",
                  variationCount: "2",
                  name: "Tauros",
                  langs: ["en", "fr"],
                },
                {
                  id: "8065",
                  variationCount: "2",
                  name: "Magikarp",
                  langs: ["en", "fr"],
                },
                {
                  id: "8066",
                  variationCount: "2",
                  name: "Gyarados",
                  langs: ["en", "fr"],
                },
                {
                  id: "8067",
                  variationCount: "2",
                  name: "Lapras",
                  langs: ["en", "fr"],
                },
                {
                  id: "8068",
                  variationCount: "2",
                  name: "Ditto",
                  langs: ["en", "fr"],
                },
                {
                  id: "8069",
                  variationCount: "2",
                  name: "Eevee",
                  langs: ["en", "fr"],
                },
                {
                  id: "8070",
                  variationCount: "2",
                  name: "Vaporeon",
                  langs: ["en", "fr"],
                },
                {
                  id: "8071",
                  variationCount: "2",
                  name: "Jolteon",
                  langs: ["en", "fr"],
                },
                {
                  id: "8072",
                  variationCount: "2",
                  name: "Flareon",
                  langs: ["en", "fr"],
                },
                {
                  id: "8073",
                  variationCount: "2",
                  name: "Porygon",
                  langs: ["en", "fr"],
                },
                {
                  id: "8074",
                  variationCount: "2",
                  name: "Omanyte",
                  langs: ["en", "fr"],
                },
                {
                  id: "8075",
                  variationCount: "2",
                  name: "Omastar",
                  langs: ["en", "fr"],
                },
                {
                  id: "8076",
                  variationCount: "2",
                  name: "Kabuto",
                  langs: ["en", "fr"],
                },
                {
                  id: "8077",
                  variationCount: "2",
                  name: "Kabutops",
                  langs: ["en", "fr"],
                },
                {
                  id: "8078",
                  variationCount: "2",
                  name: "Aerodactyl",
                  langs: ["en", "fr"],
                },
                {
                  id: "8079",
                  variationCount: "2",
                  name: "Snorlax",
                  langs: ["en", "fr"],
                },
                {
                  id: "8080",
                  variationCount: "2",
                  name: "Articuno",
                  langs: ["en", "fr"],
                },
                {
                  id: "8081",
                  variationCount: "2",
                  name: "Zapdos",
                  langs: ["en", "fr"],
                },
                {
                  id: "8082",
                  variationCount: "2",
                  name: "Moltres",
                  langs: ["en", "fr"],
                },
                {
                  id: "8083",
                  variationCount: "2",
                  name: "Dratini",
                  langs: ["en", "fr"],
                },
                {
                  id: "8084",
                  variationCount: "2",
                  name: "Dragonair",
                  langs: ["en", "fr"],
                },
                {
                  id: "8085",
                  variationCount: "2",
                  name: "Dragonite",
                  langs: ["en", "fr"],
                },
                {
                  id: "8086",
                  variationCount: "2",
                  name: "Mewtwo",
                  langs: ["en", "fr"],
                },
                {
                  id: "8088",
                  variationCount: "2",
                  name: "Chikorita",
                  langs: ["en", "fr"],
                },
                {
                  id: "8089",
                  variationCount: "2",
                  name: "Bayleef",
                  langs: ["en", "fr"],
                },
                {
                  id: "8090",
                  variationCount: "2",
                  name: "Meganium",
                  langs: ["en", "fr"],
                },
                {
                  id: "8091",
                  variationCount: "2",
                  name: "Cyndaquil",
                  langs: ["en", "fr"],
                },
                {
                  id: "8092",
                  variationCount: "2",
                  name: "Quilava",
                  langs: ["en", "fr"],
                },
                {
                  id: "8093",
                  variationCount: "2",
                  name: "Typhlosion",
                  langs: ["en", "fr"],
                },
                {
                  id: "8094",
                  variationCount: "2",
                  name: "Totodile",
                  langs: ["en", "fr"],
                },
                {
                  id: "8095",
                  variationCount: "2",
                  name: "Croconaw",
                  langs: ["en", "fr"],
                },
                {
                  id: "8096",
                  variationCount: "2",
                  name: "Feraligatr",
                  langs: ["en", "fr"],
                },
                {
                  id: "8097",
                  variationCount: "2",
                  name: "Sentret",
                  langs: ["en", "fr"],
                },
              ],
              totalCount: "707",
            })
          );
        }
      ),
    ],
  },
};

export const NoData: any = Template.bind({});
NoData.parameters = {
  msw: {
    handlers: [
      rest.get(
        `product-feeds/verification/issues/*/products?*`,
        (req, res, ctx) => {
          return res(ctx.json([]));
        }
      ),
    ],
  },
};

export const Loading: any = Template.bind({});
Loading.args = {
  mounted(this: any) {
    setTimeout(() => {
      this.$refs.page.$data.loading = true;
    }, 500);
  },
};
Loading.parameters = {
  msw: {
    handlers: [
      rest.get(
        `product-feeds/verification/issues/*/products?*`,
        (req, res, ctx) => {
          return res(ctx.json([]));
        }
      ),
    ],
  },
};

export const ErrorApi: any = Template.bind({});
ErrorApi.parameters = {
  msw: {
    handlers: [
      rest.get(
        `product-feeds/verification/issues/*/products?*`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      ),
    ],
  },
};
