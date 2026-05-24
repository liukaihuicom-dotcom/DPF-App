import type { ImageSourcePropType } from 'react-native';

export type FlagShape = 'circle' | 'square' | 'rectangle';
export type FlagAspect = '1x1' | '4x3';

export type FlagAssetDefinition = {
  aspect: Record<FlagAspect, ImageSourcePropType>;
  code: string;
  iso: boolean;
  name: string;
};

export const flagAssetRegistry = {
  "ad": {
    aspect: {
      "1x1": require("./flags/1x1/ad.svg"),
      "4x3": require("./flags/4x3/ad.svg"),
    },
    code: "ad",
    iso: true,
    name: "Andorra",
  },
  "ae": {
    aspect: {
      "1x1": require("./flags/1x1/ae.svg"),
      "4x3": require("./flags/4x3/ae.svg"),
    },
    code: "ae",
    iso: true,
    name: "United Arab Emirates",
  },
  "af": {
    aspect: {
      "1x1": require("./flags/1x1/af.svg"),
      "4x3": require("./flags/4x3/af.svg"),
    },
    code: "af",
    iso: true,
    name: "Afghanistan",
  },
  "ag": {
    aspect: {
      "1x1": require("./flags/1x1/ag.svg"),
      "4x3": require("./flags/4x3/ag.svg"),
    },
    code: "ag",
    iso: true,
    name: "Antigua and Barbuda",
  },
  "ai": {
    aspect: {
      "1x1": require("./flags/1x1/ai.svg"),
      "4x3": require("./flags/4x3/ai.svg"),
    },
    code: "ai",
    iso: true,
    name: "Anguilla",
  },
  "al": {
    aspect: {
      "1x1": require("./flags/1x1/al.svg"),
      "4x3": require("./flags/4x3/al.svg"),
    },
    code: "al",
    iso: true,
    name: "Albania",
  },
  "am": {
    aspect: {
      "1x1": require("./flags/1x1/am.svg"),
      "4x3": require("./flags/4x3/am.svg"),
    },
    code: "am",
    iso: true,
    name: "Armenia",
  },
  "ao": {
    aspect: {
      "1x1": require("./flags/1x1/ao.svg"),
      "4x3": require("./flags/4x3/ao.svg"),
    },
    code: "ao",
    iso: true,
    name: "Angola",
  },
  "aq": {
    aspect: {
      "1x1": require("./flags/1x1/aq.svg"),
      "4x3": require("./flags/4x3/aq.svg"),
    },
    code: "aq",
    iso: true,
    name: "Antarctica",
  },
  "ar": {
    aspect: {
      "1x1": require("./flags/1x1/ar.svg"),
      "4x3": require("./flags/4x3/ar.svg"),
    },
    code: "ar",
    iso: true,
    name: "Argentina",
  },
  "arab": {
    aspect: {
      "1x1": require("./flags/1x1/arab.svg"),
      "4x3": require("./flags/4x3/arab.svg"),
    },
    code: "arab",
    iso: false,
    name: "League of Arab States",
  },
  "as": {
    aspect: {
      "1x1": require("./flags/1x1/as.svg"),
      "4x3": require("./flags/4x3/as.svg"),
    },
    code: "as",
    iso: true,
    name: "American Samoa",
  },
  "asean": {
    aspect: {
      "1x1": require("./flags/1x1/asean.svg"),
      "4x3": require("./flags/4x3/asean.svg"),
    },
    code: "asean",
    iso: false,
    name: "Association of Southeast Asian Nations",
  },
  "at": {
    aspect: {
      "1x1": require("./flags/1x1/at.svg"),
      "4x3": require("./flags/4x3/at.svg"),
    },
    code: "at",
    iso: true,
    name: "Austria",
  },
  "au": {
    aspect: {
      "1x1": require("./flags/1x1/au.svg"),
      "4x3": require("./flags/4x3/au.svg"),
    },
    code: "au",
    iso: true,
    name: "Australia",
  },
  "aw": {
    aspect: {
      "1x1": require("./flags/1x1/aw.svg"),
      "4x3": require("./flags/4x3/aw.svg"),
    },
    code: "aw",
    iso: true,
    name: "Aruba",
  },
  "ax": {
    aspect: {
      "1x1": require("./flags/1x1/ax.svg"),
      "4x3": require("./flags/4x3/ax.svg"),
    },
    code: "ax",
    iso: true,
    name: "Aland Islands",
  },
  "az": {
    aspect: {
      "1x1": require("./flags/1x1/az.svg"),
      "4x3": require("./flags/4x3/az.svg"),
    },
    code: "az",
    iso: true,
    name: "Azerbaijan",
  },
  "ba": {
    aspect: {
      "1x1": require("./flags/1x1/ba.svg"),
      "4x3": require("./flags/4x3/ba.svg"),
    },
    code: "ba",
    iso: true,
    name: "Bosnia and Herzegovina",
  },
  "bb": {
    aspect: {
      "1x1": require("./flags/1x1/bb.svg"),
      "4x3": require("./flags/4x3/bb.svg"),
    },
    code: "bb",
    iso: true,
    name: "Barbados",
  },
  "bd": {
    aspect: {
      "1x1": require("./flags/1x1/bd.svg"),
      "4x3": require("./flags/4x3/bd.svg"),
    },
    code: "bd",
    iso: true,
    name: "Bangladesh",
  },
  "be": {
    aspect: {
      "1x1": require("./flags/1x1/be.svg"),
      "4x3": require("./flags/4x3/be.svg"),
    },
    code: "be",
    iso: true,
    name: "Belgium",
  },
  "bf": {
    aspect: {
      "1x1": require("./flags/1x1/bf.svg"),
      "4x3": require("./flags/4x3/bf.svg"),
    },
    code: "bf",
    iso: true,
    name: "Burkina Faso",
  },
  "bg": {
    aspect: {
      "1x1": require("./flags/1x1/bg.svg"),
      "4x3": require("./flags/4x3/bg.svg"),
    },
    code: "bg",
    iso: true,
    name: "Bulgaria",
  },
  "bh": {
    aspect: {
      "1x1": require("./flags/1x1/bh.svg"),
      "4x3": require("./flags/4x3/bh.svg"),
    },
    code: "bh",
    iso: true,
    name: "Bahrain",
  },
  "bi": {
    aspect: {
      "1x1": require("./flags/1x1/bi.svg"),
      "4x3": require("./flags/4x3/bi.svg"),
    },
    code: "bi",
    iso: true,
    name: "Burundi",
  },
  "bj": {
    aspect: {
      "1x1": require("./flags/1x1/bj.svg"),
      "4x3": require("./flags/4x3/bj.svg"),
    },
    code: "bj",
    iso: true,
    name: "Benin",
  },
  "bl": {
    aspect: {
      "1x1": require("./flags/1x1/bl.svg"),
      "4x3": require("./flags/4x3/bl.svg"),
    },
    code: "bl",
    iso: true,
    name: "Saint Barthélemy",
  },
  "bm": {
    aspect: {
      "1x1": require("./flags/1x1/bm.svg"),
      "4x3": require("./flags/4x3/bm.svg"),
    },
    code: "bm",
    iso: true,
    name: "Bermuda",
  },
  "bn": {
    aspect: {
      "1x1": require("./flags/1x1/bn.svg"),
      "4x3": require("./flags/4x3/bn.svg"),
    },
    code: "bn",
    iso: true,
    name: "Brunei Darussalam",
  },
  "bo": {
    aspect: {
      "1x1": require("./flags/1x1/bo.svg"),
      "4x3": require("./flags/4x3/bo.svg"),
    },
    code: "bo",
    iso: true,
    name: "Bolivia",
  },
  "bq": {
    aspect: {
      "1x1": require("./flags/1x1/bq.svg"),
      "4x3": require("./flags/4x3/bq.svg"),
    },
    code: "bq",
    iso: true,
    name: "Bonaire, Sint Eustatius and Saba",
  },
  "br": {
    aspect: {
      "1x1": require("./flags/1x1/br.svg"),
      "4x3": require("./flags/4x3/br.svg"),
    },
    code: "br",
    iso: true,
    name: "Brazil",
  },
  "bs": {
    aspect: {
      "1x1": require("./flags/1x1/bs.svg"),
      "4x3": require("./flags/4x3/bs.svg"),
    },
    code: "bs",
    iso: true,
    name: "Bahamas",
  },
  "bt": {
    aspect: {
      "1x1": require("./flags/1x1/bt.svg"),
      "4x3": require("./flags/4x3/bt.svg"),
    },
    code: "bt",
    iso: true,
    name: "Bhutan",
  },
  "bv": {
    aspect: {
      "1x1": require("./flags/1x1/bv.svg"),
      "4x3": require("./flags/4x3/bv.svg"),
    },
    code: "bv",
    iso: true,
    name: "Bouvet Island",
  },
  "bw": {
    aspect: {
      "1x1": require("./flags/1x1/bw.svg"),
      "4x3": require("./flags/4x3/bw.svg"),
    },
    code: "bw",
    iso: true,
    name: "Botswana",
  },
  "by": {
    aspect: {
      "1x1": require("./flags/1x1/by.svg"),
      "4x3": require("./flags/4x3/by.svg"),
    },
    code: "by",
    iso: true,
    name: "Belarus",
  },
  "bz": {
    aspect: {
      "1x1": require("./flags/1x1/bz.svg"),
      "4x3": require("./flags/4x3/bz.svg"),
    },
    code: "bz",
    iso: true,
    name: "Belize",
  },
  "ca": {
    aspect: {
      "1x1": require("./flags/1x1/ca.svg"),
      "4x3": require("./flags/4x3/ca.svg"),
    },
    code: "ca",
    iso: true,
    name: "Canada",
  },
  "cc": {
    aspect: {
      "1x1": require("./flags/1x1/cc.svg"),
      "4x3": require("./flags/4x3/cc.svg"),
    },
    code: "cc",
    iso: true,
    name: "Cocos (Keeling) Islands",
  },
  "cd": {
    aspect: {
      "1x1": require("./flags/1x1/cd.svg"),
      "4x3": require("./flags/4x3/cd.svg"),
    },
    code: "cd",
    iso: true,
    name: "Democratic Republic of the Congo",
  },
  "cefta": {
    aspect: {
      "1x1": require("./flags/1x1/cefta.svg"),
      "4x3": require("./flags/4x3/cefta.svg"),
    },
    code: "cefta",
    iso: false,
    name: "Central European Free Trade Agreement",
  },
  "cf": {
    aspect: {
      "1x1": require("./flags/1x1/cf.svg"),
      "4x3": require("./flags/4x3/cf.svg"),
    },
    code: "cf",
    iso: true,
    name: "Central African Republic",
  },
  "cg": {
    aspect: {
      "1x1": require("./flags/1x1/cg.svg"),
      "4x3": require("./flags/4x3/cg.svg"),
    },
    code: "cg",
    iso: true,
    name: "Republic of the Congo",
  },
  "ch": {
    aspect: {
      "1x1": require("./flags/1x1/ch.svg"),
      "4x3": require("./flags/4x3/ch.svg"),
    },
    code: "ch",
    iso: true,
    name: "Switzerland",
  },
  "ci": {
    aspect: {
      "1x1": require("./flags/1x1/ci.svg"),
      "4x3": require("./flags/4x3/ci.svg"),
    },
    code: "ci",
    iso: true,
    name: "Côte d'Ivoire",
  },
  "ck": {
    aspect: {
      "1x1": require("./flags/1x1/ck.svg"),
      "4x3": require("./flags/4x3/ck.svg"),
    },
    code: "ck",
    iso: true,
    name: "Cook Islands",
  },
  "cl": {
    aspect: {
      "1x1": require("./flags/1x1/cl.svg"),
      "4x3": require("./flags/4x3/cl.svg"),
    },
    code: "cl",
    iso: true,
    name: "Chile",
  },
  "cm": {
    aspect: {
      "1x1": require("./flags/1x1/cm.svg"),
      "4x3": require("./flags/4x3/cm.svg"),
    },
    code: "cm",
    iso: true,
    name: "Cameroon",
  },
  "cn": {
    aspect: {
      "1x1": require("./flags/1x1/cn.svg"),
      "4x3": require("./flags/4x3/cn.svg"),
    },
    code: "cn",
    iso: true,
    name: "China",
  },
  "co": {
    aspect: {
      "1x1": require("./flags/1x1/co.svg"),
      "4x3": require("./flags/4x3/co.svg"),
    },
    code: "co",
    iso: true,
    name: "Colombia",
  },
  "cp": {
    aspect: {
      "1x1": require("./flags/1x1/cp.svg"),
      "4x3": require("./flags/4x3/cp.svg"),
    },
    code: "cp",
    iso: false,
    name: "Clipperton Island",
  },
  "cr": {
    aspect: {
      "1x1": require("./flags/1x1/cr.svg"),
      "4x3": require("./flags/4x3/cr.svg"),
    },
    code: "cr",
    iso: true,
    name: "Costa Rica",
  },
  "cu": {
    aspect: {
      "1x1": require("./flags/1x1/cu.svg"),
      "4x3": require("./flags/4x3/cu.svg"),
    },
    code: "cu",
    iso: true,
    name: "Cuba",
  },
  "cv": {
    aspect: {
      "1x1": require("./flags/1x1/cv.svg"),
      "4x3": require("./flags/4x3/cv.svg"),
    },
    code: "cv",
    iso: true,
    name: "Cabo Verde",
  },
  "cw": {
    aspect: {
      "1x1": require("./flags/1x1/cw.svg"),
      "4x3": require("./flags/4x3/cw.svg"),
    },
    code: "cw",
    iso: true,
    name: "Curaçao",
  },
  "cx": {
    aspect: {
      "1x1": require("./flags/1x1/cx.svg"),
      "4x3": require("./flags/4x3/cx.svg"),
    },
    code: "cx",
    iso: true,
    name: "Christmas Island",
  },
  "cy": {
    aspect: {
      "1x1": require("./flags/1x1/cy.svg"),
      "4x3": require("./flags/4x3/cy.svg"),
    },
    code: "cy",
    iso: true,
    name: "Cyprus",
  },
  "cz": {
    aspect: {
      "1x1": require("./flags/1x1/cz.svg"),
      "4x3": require("./flags/4x3/cz.svg"),
    },
    code: "cz",
    iso: true,
    name: "Czech Republic",
  },
  "de": {
    aspect: {
      "1x1": require("./flags/1x1/de.svg"),
      "4x3": require("./flags/4x3/de.svg"),
    },
    code: "de",
    iso: true,
    name: "Germany",
  },
  "dg": {
    aspect: {
      "1x1": require("./flags/1x1/dg.svg"),
      "4x3": require("./flags/4x3/dg.svg"),
    },
    code: "dg",
    iso: false,
    name: "Diego Garcia",
  },
  "dj": {
    aspect: {
      "1x1": require("./flags/1x1/dj.svg"),
      "4x3": require("./flags/4x3/dj.svg"),
    },
    code: "dj",
    iso: true,
    name: "Djibouti",
  },
  "dk": {
    aspect: {
      "1x1": require("./flags/1x1/dk.svg"),
      "4x3": require("./flags/4x3/dk.svg"),
    },
    code: "dk",
    iso: true,
    name: "Denmark",
  },
  "dm": {
    aspect: {
      "1x1": require("./flags/1x1/dm.svg"),
      "4x3": require("./flags/4x3/dm.svg"),
    },
    code: "dm",
    iso: true,
    name: "Dominica",
  },
  "do": {
    aspect: {
      "1x1": require("./flags/1x1/do.svg"),
      "4x3": require("./flags/4x3/do.svg"),
    },
    code: "do",
    iso: true,
    name: "Dominican Republic",
  },
  "dz": {
    aspect: {
      "1x1": require("./flags/1x1/dz.svg"),
      "4x3": require("./flags/4x3/dz.svg"),
    },
    code: "dz",
    iso: true,
    name: "Algeria",
  },
  "eac": {
    aspect: {
      "1x1": require("./flags/1x1/eac.svg"),
      "4x3": require("./flags/4x3/eac.svg"),
    },
    code: "eac",
    iso: false,
    name: "East African Community",
  },
  "ec": {
    aspect: {
      "1x1": require("./flags/1x1/ec.svg"),
      "4x3": require("./flags/4x3/ec.svg"),
    },
    code: "ec",
    iso: true,
    name: "Ecuador",
  },
  "ee": {
    aspect: {
      "1x1": require("./flags/1x1/ee.svg"),
      "4x3": require("./flags/4x3/ee.svg"),
    },
    code: "ee",
    iso: true,
    name: "Estonia",
  },
  "eg": {
    aspect: {
      "1x1": require("./flags/1x1/eg.svg"),
      "4x3": require("./flags/4x3/eg.svg"),
    },
    code: "eg",
    iso: true,
    name: "Egypt",
  },
  "eh": {
    aspect: {
      "1x1": require("./flags/1x1/eh.svg"),
      "4x3": require("./flags/4x3/eh.svg"),
    },
    code: "eh",
    iso: true,
    name: "Western Sahara",
  },
  "er": {
    aspect: {
      "1x1": require("./flags/1x1/er.svg"),
      "4x3": require("./flags/4x3/er.svg"),
    },
    code: "er",
    iso: true,
    name: "Eritrea",
  },
  "es": {
    aspect: {
      "1x1": require("./flags/1x1/es.svg"),
      "4x3": require("./flags/4x3/es.svg"),
    },
    code: "es",
    iso: true,
    name: "Spain",
  },
  "es-ct": {
    aspect: {
      "1x1": require("./flags/1x1/es-ct.svg"),
      "4x3": require("./flags/4x3/es-ct.svg"),
    },
    code: "es-ct",
    iso: false,
    name: "Catalonia",
  },
  "es-ga": {
    aspect: {
      "1x1": require("./flags/1x1/es-ga.svg"),
      "4x3": require("./flags/4x3/es-ga.svg"),
    },
    code: "es-ga",
    iso: false,
    name: "Galicia",
  },
  "es-pv": {
    aspect: {
      "1x1": require("./flags/1x1/es-pv.svg"),
      "4x3": require("./flags/4x3/es-pv.svg"),
    },
    code: "es-pv",
    iso: false,
    name: "Basque Country",
  },
  "et": {
    aspect: {
      "1x1": require("./flags/1x1/et.svg"),
      "4x3": require("./flags/4x3/et.svg"),
    },
    code: "et",
    iso: true,
    name: "Ethiopia",
  },
  "eu": {
    aspect: {
      "1x1": require("./flags/1x1/eu.svg"),
      "4x3": require("./flags/4x3/eu.svg"),
    },
    code: "eu",
    iso: false,
    name: "Europe",
  },
  "fi": {
    aspect: {
      "1x1": require("./flags/1x1/fi.svg"),
      "4x3": require("./flags/4x3/fi.svg"),
    },
    code: "fi",
    iso: true,
    name: "Finland",
  },
  "fj": {
    aspect: {
      "1x1": require("./flags/1x1/fj.svg"),
      "4x3": require("./flags/4x3/fj.svg"),
    },
    code: "fj",
    iso: true,
    name: "Fiji",
  },
  "fk": {
    aspect: {
      "1x1": require("./flags/1x1/fk.svg"),
      "4x3": require("./flags/4x3/fk.svg"),
    },
    code: "fk",
    iso: true,
    name: "Falkland Islands",
  },
  "fm": {
    aspect: {
      "1x1": require("./flags/1x1/fm.svg"),
      "4x3": require("./flags/4x3/fm.svg"),
    },
    code: "fm",
    iso: true,
    name: "Federated States of Micronesia",
  },
  "fo": {
    aspect: {
      "1x1": require("./flags/1x1/fo.svg"),
      "4x3": require("./flags/4x3/fo.svg"),
    },
    code: "fo",
    iso: true,
    name: "Faroe Islands",
  },
  "fr": {
    aspect: {
      "1x1": require("./flags/1x1/fr.svg"),
      "4x3": require("./flags/4x3/fr.svg"),
    },
    code: "fr",
    iso: true,
    name: "France",
  },
  "ga": {
    aspect: {
      "1x1": require("./flags/1x1/ga.svg"),
      "4x3": require("./flags/4x3/ga.svg"),
    },
    code: "ga",
    iso: true,
    name: "Gabon",
  },
  "gb": {
    aspect: {
      "1x1": require("./flags/1x1/gb.svg"),
      "4x3": require("./flags/4x3/gb.svg"),
    },
    code: "gb",
    iso: true,
    name: "United Kingdom",
  },
  "gb-eng": {
    aspect: {
      "1x1": require("./flags/1x1/gb-eng.svg"),
      "4x3": require("./flags/4x3/gb-eng.svg"),
    },
    code: "gb-eng",
    iso: false,
    name: "England",
  },
  "gb-nir": {
    aspect: {
      "1x1": require("./flags/1x1/gb-nir.svg"),
      "4x3": require("./flags/4x3/gb-nir.svg"),
    },
    code: "gb-nir",
    iso: false,
    name: "Northern Ireland",
  },
  "gb-sct": {
    aspect: {
      "1x1": require("./flags/1x1/gb-sct.svg"),
      "4x3": require("./flags/4x3/gb-sct.svg"),
    },
    code: "gb-sct",
    iso: false,
    name: "Scotland",
  },
  "gb-wls": {
    aspect: {
      "1x1": require("./flags/1x1/gb-wls.svg"),
      "4x3": require("./flags/4x3/gb-wls.svg"),
    },
    code: "gb-wls",
    iso: false,
    name: "Wales",
  },
  "gd": {
    aspect: {
      "1x1": require("./flags/1x1/gd.svg"),
      "4x3": require("./flags/4x3/gd.svg"),
    },
    code: "gd",
    iso: true,
    name: "Grenada",
  },
  "ge": {
    aspect: {
      "1x1": require("./flags/1x1/ge.svg"),
      "4x3": require("./flags/4x3/ge.svg"),
    },
    code: "ge",
    iso: true,
    name: "Georgia",
  },
  "gf": {
    aspect: {
      "1x1": require("./flags/1x1/gf.svg"),
      "4x3": require("./flags/4x3/gf.svg"),
    },
    code: "gf",
    iso: true,
    name: "French Guiana",
  },
  "gg": {
    aspect: {
      "1x1": require("./flags/1x1/gg.svg"),
      "4x3": require("./flags/4x3/gg.svg"),
    },
    code: "gg",
    iso: true,
    name: "Guernsey",
  },
  "gh": {
    aspect: {
      "1x1": require("./flags/1x1/gh.svg"),
      "4x3": require("./flags/4x3/gh.svg"),
    },
    code: "gh",
    iso: true,
    name: "Ghana",
  },
  "gi": {
    aspect: {
      "1x1": require("./flags/1x1/gi.svg"),
      "4x3": require("./flags/4x3/gi.svg"),
    },
    code: "gi",
    iso: true,
    name: "Gibraltar",
  },
  "gl": {
    aspect: {
      "1x1": require("./flags/1x1/gl.svg"),
      "4x3": require("./flags/4x3/gl.svg"),
    },
    code: "gl",
    iso: true,
    name: "Greenland",
  },
  "gm": {
    aspect: {
      "1x1": require("./flags/1x1/gm.svg"),
      "4x3": require("./flags/4x3/gm.svg"),
    },
    code: "gm",
    iso: true,
    name: "Gambia",
  },
  "gn": {
    aspect: {
      "1x1": require("./flags/1x1/gn.svg"),
      "4x3": require("./flags/4x3/gn.svg"),
    },
    code: "gn",
    iso: true,
    name: "Guinea",
  },
  "gp": {
    aspect: {
      "1x1": require("./flags/1x1/gp.svg"),
      "4x3": require("./flags/4x3/gp.svg"),
    },
    code: "gp",
    iso: true,
    name: "Guadeloupe",
  },
  "gq": {
    aspect: {
      "1x1": require("./flags/1x1/gq.svg"),
      "4x3": require("./flags/4x3/gq.svg"),
    },
    code: "gq",
    iso: true,
    name: "Equatorial Guinea",
  },
  "gr": {
    aspect: {
      "1x1": require("./flags/1x1/gr.svg"),
      "4x3": require("./flags/4x3/gr.svg"),
    },
    code: "gr",
    iso: true,
    name: "Greece",
  },
  "gs": {
    aspect: {
      "1x1": require("./flags/1x1/gs.svg"),
      "4x3": require("./flags/4x3/gs.svg"),
    },
    code: "gs",
    iso: true,
    name: "South Georgia and the South Sandwich Islands",
  },
  "gt": {
    aspect: {
      "1x1": require("./flags/1x1/gt.svg"),
      "4x3": require("./flags/4x3/gt.svg"),
    },
    code: "gt",
    iso: true,
    name: "Guatemala",
  },
  "gu": {
    aspect: {
      "1x1": require("./flags/1x1/gu.svg"),
      "4x3": require("./flags/4x3/gu.svg"),
    },
    code: "gu",
    iso: true,
    name: "Guam",
  },
  "gw": {
    aspect: {
      "1x1": require("./flags/1x1/gw.svg"),
      "4x3": require("./flags/4x3/gw.svg"),
    },
    code: "gw",
    iso: true,
    name: "Guinea-Bissau",
  },
  "gy": {
    aspect: {
      "1x1": require("./flags/1x1/gy.svg"),
      "4x3": require("./flags/4x3/gy.svg"),
    },
    code: "gy",
    iso: true,
    name: "Guyana",
  },
  "hk": {
    aspect: {
      "1x1": require("./flags/1x1/hk.svg"),
      "4x3": require("./flags/4x3/hk.svg"),
    },
    code: "hk",
    iso: true,
    name: "Hong Kong",
  },
  "hm": {
    aspect: {
      "1x1": require("./flags/1x1/hm.svg"),
      "4x3": require("./flags/4x3/hm.svg"),
    },
    code: "hm",
    iso: true,
    name: "Heard Island and McDonald Islands",
  },
  "hn": {
    aspect: {
      "1x1": require("./flags/1x1/hn.svg"),
      "4x3": require("./flags/4x3/hn.svg"),
    },
    code: "hn",
    iso: true,
    name: "Honduras",
  },
  "hr": {
    aspect: {
      "1x1": require("./flags/1x1/hr.svg"),
      "4x3": require("./flags/4x3/hr.svg"),
    },
    code: "hr",
    iso: true,
    name: "Croatia",
  },
  "ht": {
    aspect: {
      "1x1": require("./flags/1x1/ht.svg"),
      "4x3": require("./flags/4x3/ht.svg"),
    },
    code: "ht",
    iso: true,
    name: "Haiti",
  },
  "hu": {
    aspect: {
      "1x1": require("./flags/1x1/hu.svg"),
      "4x3": require("./flags/4x3/hu.svg"),
    },
    code: "hu",
    iso: true,
    name: "Hungary",
  },
  "ic": {
    aspect: {
      "1x1": require("./flags/1x1/ic.svg"),
      "4x3": require("./flags/4x3/ic.svg"),
    },
    code: "ic",
    iso: false,
    name: "Canary Islands",
  },
  "id": {
    aspect: {
      "1x1": require("./flags/1x1/id.svg"),
      "4x3": require("./flags/4x3/id.svg"),
    },
    code: "id",
    iso: true,
    name: "Indonesia",
  },
  "ie": {
    aspect: {
      "1x1": require("./flags/1x1/ie.svg"),
      "4x3": require("./flags/4x3/ie.svg"),
    },
    code: "ie",
    iso: true,
    name: "Ireland",
  },
  "il": {
    aspect: {
      "1x1": require("./flags/1x1/il.svg"),
      "4x3": require("./flags/4x3/il.svg"),
    },
    code: "il",
    iso: true,
    name: "Israel",
  },
  "im": {
    aspect: {
      "1x1": require("./flags/1x1/im.svg"),
      "4x3": require("./flags/4x3/im.svg"),
    },
    code: "im",
    iso: true,
    name: "Isle of Man",
  },
  "in": {
    aspect: {
      "1x1": require("./flags/1x1/in.svg"),
      "4x3": require("./flags/4x3/in.svg"),
    },
    code: "in",
    iso: true,
    name: "India",
  },
  "io": {
    aspect: {
      "1x1": require("./flags/1x1/io.svg"),
      "4x3": require("./flags/4x3/io.svg"),
    },
    code: "io",
    iso: true,
    name: "British Indian Ocean Territory",
  },
  "iq": {
    aspect: {
      "1x1": require("./flags/1x1/iq.svg"),
      "4x3": require("./flags/4x3/iq.svg"),
    },
    code: "iq",
    iso: true,
    name: "Iraq",
  },
  "ir": {
    aspect: {
      "1x1": require("./flags/1x1/ir.svg"),
      "4x3": require("./flags/4x3/ir.svg"),
    },
    code: "ir",
    iso: true,
    name: "Iran",
  },
  "is": {
    aspect: {
      "1x1": require("./flags/1x1/is.svg"),
      "4x3": require("./flags/4x3/is.svg"),
    },
    code: "is",
    iso: true,
    name: "Iceland",
  },
  "it": {
    aspect: {
      "1x1": require("./flags/1x1/it.svg"),
      "4x3": require("./flags/4x3/it.svg"),
    },
    code: "it",
    iso: true,
    name: "Italy",
  },
  "je": {
    aspect: {
      "1x1": require("./flags/1x1/je.svg"),
      "4x3": require("./flags/4x3/je.svg"),
    },
    code: "je",
    iso: true,
    name: "Jersey",
  },
  "jm": {
    aspect: {
      "1x1": require("./flags/1x1/jm.svg"),
      "4x3": require("./flags/4x3/jm.svg"),
    },
    code: "jm",
    iso: true,
    name: "Jamaica",
  },
  "jo": {
    aspect: {
      "1x1": require("./flags/1x1/jo.svg"),
      "4x3": require("./flags/4x3/jo.svg"),
    },
    code: "jo",
    iso: true,
    name: "Jordan",
  },
  "jp": {
    aspect: {
      "1x1": require("./flags/1x1/jp.svg"),
      "4x3": require("./flags/4x3/jp.svg"),
    },
    code: "jp",
    iso: true,
    name: "Japan",
  },
  "ke": {
    aspect: {
      "1x1": require("./flags/1x1/ke.svg"),
      "4x3": require("./flags/4x3/ke.svg"),
    },
    code: "ke",
    iso: true,
    name: "Kenya",
  },
  "kg": {
    aspect: {
      "1x1": require("./flags/1x1/kg.svg"),
      "4x3": require("./flags/4x3/kg.svg"),
    },
    code: "kg",
    iso: true,
    name: "Kyrgyzstan",
  },
  "kh": {
    aspect: {
      "1x1": require("./flags/1x1/kh.svg"),
      "4x3": require("./flags/4x3/kh.svg"),
    },
    code: "kh",
    iso: true,
    name: "Cambodia",
  },
  "ki": {
    aspect: {
      "1x1": require("./flags/1x1/ki.svg"),
      "4x3": require("./flags/4x3/ki.svg"),
    },
    code: "ki",
    iso: true,
    name: "Kiribati",
  },
  "km": {
    aspect: {
      "1x1": require("./flags/1x1/km.svg"),
      "4x3": require("./flags/4x3/km.svg"),
    },
    code: "km",
    iso: true,
    name: "Comoros",
  },
  "kn": {
    aspect: {
      "1x1": require("./flags/1x1/kn.svg"),
      "4x3": require("./flags/4x3/kn.svg"),
    },
    code: "kn",
    iso: true,
    name: "Saint Kitts and Nevis",
  },
  "kp": {
    aspect: {
      "1x1": require("./flags/1x1/kp.svg"),
      "4x3": require("./flags/4x3/kp.svg"),
    },
    code: "kp",
    iso: true,
    name: "North Korea",
  },
  "kr": {
    aspect: {
      "1x1": require("./flags/1x1/kr.svg"),
      "4x3": require("./flags/4x3/kr.svg"),
    },
    code: "kr",
    iso: true,
    name: "South Korea",
  },
  "kw": {
    aspect: {
      "1x1": require("./flags/1x1/kw.svg"),
      "4x3": require("./flags/4x3/kw.svg"),
    },
    code: "kw",
    iso: true,
    name: "Kuwait",
  },
  "ky": {
    aspect: {
      "1x1": require("./flags/1x1/ky.svg"),
      "4x3": require("./flags/4x3/ky.svg"),
    },
    code: "ky",
    iso: true,
    name: "Cayman Islands",
  },
  "kz": {
    aspect: {
      "1x1": require("./flags/1x1/kz.svg"),
      "4x3": require("./flags/4x3/kz.svg"),
    },
    code: "kz",
    iso: true,
    name: "Kazakhstan",
  },
  "la": {
    aspect: {
      "1x1": require("./flags/1x1/la.svg"),
      "4x3": require("./flags/4x3/la.svg"),
    },
    code: "la",
    iso: true,
    name: "Laos",
  },
  "lb": {
    aspect: {
      "1x1": require("./flags/1x1/lb.svg"),
      "4x3": require("./flags/4x3/lb.svg"),
    },
    code: "lb",
    iso: true,
    name: "Lebanon",
  },
  "lc": {
    aspect: {
      "1x1": require("./flags/1x1/lc.svg"),
      "4x3": require("./flags/4x3/lc.svg"),
    },
    code: "lc",
    iso: true,
    name: "Saint Lucia",
  },
  "li": {
    aspect: {
      "1x1": require("./flags/1x1/li.svg"),
      "4x3": require("./flags/4x3/li.svg"),
    },
    code: "li",
    iso: true,
    name: "Liechtenstein",
  },
  "lk": {
    aspect: {
      "1x1": require("./flags/1x1/lk.svg"),
      "4x3": require("./flags/4x3/lk.svg"),
    },
    code: "lk",
    iso: true,
    name: "Sri Lanka",
  },
  "lr": {
    aspect: {
      "1x1": require("./flags/1x1/lr.svg"),
      "4x3": require("./flags/4x3/lr.svg"),
    },
    code: "lr",
    iso: true,
    name: "Liberia",
  },
  "ls": {
    aspect: {
      "1x1": require("./flags/1x1/ls.svg"),
      "4x3": require("./flags/4x3/ls.svg"),
    },
    code: "ls",
    iso: true,
    name: "Lesotho",
  },
  "lt": {
    aspect: {
      "1x1": require("./flags/1x1/lt.svg"),
      "4x3": require("./flags/4x3/lt.svg"),
    },
    code: "lt",
    iso: true,
    name: "Lithuania",
  },
  "lu": {
    aspect: {
      "1x1": require("./flags/1x1/lu.svg"),
      "4x3": require("./flags/4x3/lu.svg"),
    },
    code: "lu",
    iso: true,
    name: "Luxembourg",
  },
  "lv": {
    aspect: {
      "1x1": require("./flags/1x1/lv.svg"),
      "4x3": require("./flags/4x3/lv.svg"),
    },
    code: "lv",
    iso: true,
    name: "Latvia",
  },
  "ly": {
    aspect: {
      "1x1": require("./flags/1x1/ly.svg"),
      "4x3": require("./flags/4x3/ly.svg"),
    },
    code: "ly",
    iso: true,
    name: "Libya",
  },
  "ma": {
    aspect: {
      "1x1": require("./flags/1x1/ma.svg"),
      "4x3": require("./flags/4x3/ma.svg"),
    },
    code: "ma",
    iso: true,
    name: "Morocco",
  },
  "mc": {
    aspect: {
      "1x1": require("./flags/1x1/mc.svg"),
      "4x3": require("./flags/4x3/mc.svg"),
    },
    code: "mc",
    iso: true,
    name: "Monaco",
  },
  "md": {
    aspect: {
      "1x1": require("./flags/1x1/md.svg"),
      "4x3": require("./flags/4x3/md.svg"),
    },
    code: "md",
    iso: true,
    name: "Moldova",
  },
  "me": {
    aspect: {
      "1x1": require("./flags/1x1/me.svg"),
      "4x3": require("./flags/4x3/me.svg"),
    },
    code: "me",
    iso: true,
    name: "Montenegro",
  },
  "mf": {
    aspect: {
      "1x1": require("./flags/1x1/mf.svg"),
      "4x3": require("./flags/4x3/mf.svg"),
    },
    code: "mf",
    iso: true,
    name: "Saint Martin",
  },
  "mg": {
    aspect: {
      "1x1": require("./flags/1x1/mg.svg"),
      "4x3": require("./flags/4x3/mg.svg"),
    },
    code: "mg",
    iso: true,
    name: "Madagascar",
  },
  "mh": {
    aspect: {
      "1x1": require("./flags/1x1/mh.svg"),
      "4x3": require("./flags/4x3/mh.svg"),
    },
    code: "mh",
    iso: true,
    name: "Marshall Islands",
  },
  "mk": {
    aspect: {
      "1x1": require("./flags/1x1/mk.svg"),
      "4x3": require("./flags/4x3/mk.svg"),
    },
    code: "mk",
    iso: true,
    name: "North Macedonia",
  },
  "ml": {
    aspect: {
      "1x1": require("./flags/1x1/ml.svg"),
      "4x3": require("./flags/4x3/ml.svg"),
    },
    code: "ml",
    iso: true,
    name: "Mali",
  },
  "mm": {
    aspect: {
      "1x1": require("./flags/1x1/mm.svg"),
      "4x3": require("./flags/4x3/mm.svg"),
    },
    code: "mm",
    iso: true,
    name: "Myanmar",
  },
  "mn": {
    aspect: {
      "1x1": require("./flags/1x1/mn.svg"),
      "4x3": require("./flags/4x3/mn.svg"),
    },
    code: "mn",
    iso: true,
    name: "Mongolia",
  },
  "mo": {
    aspect: {
      "1x1": require("./flags/1x1/mo.svg"),
      "4x3": require("./flags/4x3/mo.svg"),
    },
    code: "mo",
    iso: true,
    name: "Macau",
  },
  "mp": {
    aspect: {
      "1x1": require("./flags/1x1/mp.svg"),
      "4x3": require("./flags/4x3/mp.svg"),
    },
    code: "mp",
    iso: true,
    name: "Northern Mariana Islands",
  },
  "mq": {
    aspect: {
      "1x1": require("./flags/1x1/mq.svg"),
      "4x3": require("./flags/4x3/mq.svg"),
    },
    code: "mq",
    iso: true,
    name: "Martinique",
  },
  "mr": {
    aspect: {
      "1x1": require("./flags/1x1/mr.svg"),
      "4x3": require("./flags/4x3/mr.svg"),
    },
    code: "mr",
    iso: true,
    name: "Mauritania",
  },
  "ms": {
    aspect: {
      "1x1": require("./flags/1x1/ms.svg"),
      "4x3": require("./flags/4x3/ms.svg"),
    },
    code: "ms",
    iso: true,
    name: "Montserrat",
  },
  "mt": {
    aspect: {
      "1x1": require("./flags/1x1/mt.svg"),
      "4x3": require("./flags/4x3/mt.svg"),
    },
    code: "mt",
    iso: true,
    name: "Malta",
  },
  "mu": {
    aspect: {
      "1x1": require("./flags/1x1/mu.svg"),
      "4x3": require("./flags/4x3/mu.svg"),
    },
    code: "mu",
    iso: true,
    name: "Mauritius",
  },
  "mv": {
    aspect: {
      "1x1": require("./flags/1x1/mv.svg"),
      "4x3": require("./flags/4x3/mv.svg"),
    },
    code: "mv",
    iso: true,
    name: "Maldives",
  },
  "mw": {
    aspect: {
      "1x1": require("./flags/1x1/mw.svg"),
      "4x3": require("./flags/4x3/mw.svg"),
    },
    code: "mw",
    iso: true,
    name: "Malawi",
  },
  "mx": {
    aspect: {
      "1x1": require("./flags/1x1/mx.svg"),
      "4x3": require("./flags/4x3/mx.svg"),
    },
    code: "mx",
    iso: true,
    name: "Mexico",
  },
  "my": {
    aspect: {
      "1x1": require("./flags/1x1/my.svg"),
      "4x3": require("./flags/4x3/my.svg"),
    },
    code: "my",
    iso: true,
    name: "Malaysia",
  },
  "mz": {
    aspect: {
      "1x1": require("./flags/1x1/mz.svg"),
      "4x3": require("./flags/4x3/mz.svg"),
    },
    code: "mz",
    iso: true,
    name: "Mozambique",
  },
  "na": {
    aspect: {
      "1x1": require("./flags/1x1/na.svg"),
      "4x3": require("./flags/4x3/na.svg"),
    },
    code: "na",
    iso: true,
    name: "Namibia",
  },
  "nc": {
    aspect: {
      "1x1": require("./flags/1x1/nc.svg"),
      "4x3": require("./flags/4x3/nc.svg"),
    },
    code: "nc",
    iso: true,
    name: "New Caledonia",
  },
  "ne": {
    aspect: {
      "1x1": require("./flags/1x1/ne.svg"),
      "4x3": require("./flags/4x3/ne.svg"),
    },
    code: "ne",
    iso: true,
    name: "Niger",
  },
  "nf": {
    aspect: {
      "1x1": require("./flags/1x1/nf.svg"),
      "4x3": require("./flags/4x3/nf.svg"),
    },
    code: "nf",
    iso: true,
    name: "Norfolk Island",
  },
  "ng": {
    aspect: {
      "1x1": require("./flags/1x1/ng.svg"),
      "4x3": require("./flags/4x3/ng.svg"),
    },
    code: "ng",
    iso: true,
    name: "Nigeria",
  },
  "ni": {
    aspect: {
      "1x1": require("./flags/1x1/ni.svg"),
      "4x3": require("./flags/4x3/ni.svg"),
    },
    code: "ni",
    iso: true,
    name: "Nicaragua",
  },
  "nl": {
    aspect: {
      "1x1": require("./flags/1x1/nl.svg"),
      "4x3": require("./flags/4x3/nl.svg"),
    },
    code: "nl",
    iso: true,
    name: "Netherlands",
  },
  "no": {
    aspect: {
      "1x1": require("./flags/1x1/no.svg"),
      "4x3": require("./flags/4x3/no.svg"),
    },
    code: "no",
    iso: true,
    name: "Norway",
  },
  "np": {
    aspect: {
      "1x1": require("./flags/1x1/np.svg"),
      "4x3": require("./flags/4x3/np.svg"),
    },
    code: "np",
    iso: true,
    name: "Nepal",
  },
  "nr": {
    aspect: {
      "1x1": require("./flags/1x1/nr.svg"),
      "4x3": require("./flags/4x3/nr.svg"),
    },
    code: "nr",
    iso: true,
    name: "Nauru",
  },
  "nu": {
    aspect: {
      "1x1": require("./flags/1x1/nu.svg"),
      "4x3": require("./flags/4x3/nu.svg"),
    },
    code: "nu",
    iso: true,
    name: "Niue",
  },
  "nz": {
    aspect: {
      "1x1": require("./flags/1x1/nz.svg"),
      "4x3": require("./flags/4x3/nz.svg"),
    },
    code: "nz",
    iso: true,
    name: "New Zealand",
  },
  "om": {
    aspect: {
      "1x1": require("./flags/1x1/om.svg"),
      "4x3": require("./flags/4x3/om.svg"),
    },
    code: "om",
    iso: true,
    name: "Oman",
  },
  "pa": {
    aspect: {
      "1x1": require("./flags/1x1/pa.svg"),
      "4x3": require("./flags/4x3/pa.svg"),
    },
    code: "pa",
    iso: true,
    name: "Panama",
  },
  "pc": {
    aspect: {
      "1x1": require("./flags/1x1/pc.svg"),
      "4x3": require("./flags/4x3/pc.svg"),
    },
    code: "pc",
    iso: false,
    name: "Pacific Community",
  },
  "pe": {
    aspect: {
      "1x1": require("./flags/1x1/pe.svg"),
      "4x3": require("./flags/4x3/pe.svg"),
    },
    code: "pe",
    iso: true,
    name: "Peru",
  },
  "pf": {
    aspect: {
      "1x1": require("./flags/1x1/pf.svg"),
      "4x3": require("./flags/4x3/pf.svg"),
    },
    code: "pf",
    iso: true,
    name: "French Polynesia",
  },
  "pg": {
    aspect: {
      "1x1": require("./flags/1x1/pg.svg"),
      "4x3": require("./flags/4x3/pg.svg"),
    },
    code: "pg",
    iso: true,
    name: "Papua New Guinea",
  },
  "ph": {
    aspect: {
      "1x1": require("./flags/1x1/ph.svg"),
      "4x3": require("./flags/4x3/ph.svg"),
    },
    code: "ph",
    iso: true,
    name: "Philippines",
  },
  "pk": {
    aspect: {
      "1x1": require("./flags/1x1/pk.svg"),
      "4x3": require("./flags/4x3/pk.svg"),
    },
    code: "pk",
    iso: true,
    name: "Pakistan",
  },
  "pl": {
    aspect: {
      "1x1": require("./flags/1x1/pl.svg"),
      "4x3": require("./flags/4x3/pl.svg"),
    },
    code: "pl",
    iso: true,
    name: "Poland",
  },
  "pm": {
    aspect: {
      "1x1": require("./flags/1x1/pm.svg"),
      "4x3": require("./flags/4x3/pm.svg"),
    },
    code: "pm",
    iso: true,
    name: "Saint Pierre and Miquelon",
  },
  "pn": {
    aspect: {
      "1x1": require("./flags/1x1/pn.svg"),
      "4x3": require("./flags/4x3/pn.svg"),
    },
    code: "pn",
    iso: true,
    name: "Pitcairn",
  },
  "pr": {
    aspect: {
      "1x1": require("./flags/1x1/pr.svg"),
      "4x3": require("./flags/4x3/pr.svg"),
    },
    code: "pr",
    iso: true,
    name: "Puerto Rico",
  },
  "ps": {
    aspect: {
      "1x1": require("./flags/1x1/ps.svg"),
      "4x3": require("./flags/4x3/ps.svg"),
    },
    code: "ps",
    iso: true,
    name: "State of Palestine",
  },
  "pt": {
    aspect: {
      "1x1": require("./flags/1x1/pt.svg"),
      "4x3": require("./flags/4x3/pt.svg"),
    },
    code: "pt",
    iso: true,
    name: "Portugal",
  },
  "pw": {
    aspect: {
      "1x1": require("./flags/1x1/pw.svg"),
      "4x3": require("./flags/4x3/pw.svg"),
    },
    code: "pw",
    iso: true,
    name: "Palau",
  },
  "py": {
    aspect: {
      "1x1": require("./flags/1x1/py.svg"),
      "4x3": require("./flags/4x3/py.svg"),
    },
    code: "py",
    iso: true,
    name: "Paraguay",
  },
  "qa": {
    aspect: {
      "1x1": require("./flags/1x1/qa.svg"),
      "4x3": require("./flags/4x3/qa.svg"),
    },
    code: "qa",
    iso: true,
    name: "Qatar",
  },
  "re": {
    aspect: {
      "1x1": require("./flags/1x1/re.svg"),
      "4x3": require("./flags/4x3/re.svg"),
    },
    code: "re",
    iso: true,
    name: "Réunion",
  },
  "ro": {
    aspect: {
      "1x1": require("./flags/1x1/ro.svg"),
      "4x3": require("./flags/4x3/ro.svg"),
    },
    code: "ro",
    iso: true,
    name: "Romania",
  },
  "rs": {
    aspect: {
      "1x1": require("./flags/1x1/rs.svg"),
      "4x3": require("./flags/4x3/rs.svg"),
    },
    code: "rs",
    iso: true,
    name: "Serbia",
  },
  "ru": {
    aspect: {
      "1x1": require("./flags/1x1/ru.svg"),
      "4x3": require("./flags/4x3/ru.svg"),
    },
    code: "ru",
    iso: true,
    name: "Russia",
  },
  "rw": {
    aspect: {
      "1x1": require("./flags/1x1/rw.svg"),
      "4x3": require("./flags/4x3/rw.svg"),
    },
    code: "rw",
    iso: true,
    name: "Rwanda",
  },
  "sa": {
    aspect: {
      "1x1": require("./flags/1x1/sa.svg"),
      "4x3": require("./flags/4x3/sa.svg"),
    },
    code: "sa",
    iso: true,
    name: "Saudi Arabia",
  },
  "sb": {
    aspect: {
      "1x1": require("./flags/1x1/sb.svg"),
      "4x3": require("./flags/4x3/sb.svg"),
    },
    code: "sb",
    iso: true,
    name: "Solomon Islands",
  },
  "sc": {
    aspect: {
      "1x1": require("./flags/1x1/sc.svg"),
      "4x3": require("./flags/4x3/sc.svg"),
    },
    code: "sc",
    iso: true,
    name: "Seychelles",
  },
  "sd": {
    aspect: {
      "1x1": require("./flags/1x1/sd.svg"),
      "4x3": require("./flags/4x3/sd.svg"),
    },
    code: "sd",
    iso: true,
    name: "Sudan",
  },
  "se": {
    aspect: {
      "1x1": require("./flags/1x1/se.svg"),
      "4x3": require("./flags/4x3/se.svg"),
    },
    code: "se",
    iso: true,
    name: "Sweden",
  },
  "sg": {
    aspect: {
      "1x1": require("./flags/1x1/sg.svg"),
      "4x3": require("./flags/4x3/sg.svg"),
    },
    code: "sg",
    iso: true,
    name: "Singapore",
  },
  "sh": {
    aspect: {
      "1x1": require("./flags/1x1/sh.svg"),
      "4x3": require("./flags/4x3/sh.svg"),
    },
    code: "sh",
    iso: true,
    name: "Saint Helena, Ascension and Tristan da Cunha",
  },
  "sh-ac": {
    aspect: {
      "1x1": require("./flags/1x1/sh-ac.svg"),
      "4x3": require("./flags/4x3/sh-ac.svg"),
    },
    code: "sh-ac",
    iso: false,
    name: "Ascension Island",
  },
  "sh-hl": {
    aspect: {
      "1x1": require("./flags/1x1/sh-hl.svg"),
      "4x3": require("./flags/4x3/sh-hl.svg"),
    },
    code: "sh-hl",
    iso: false,
    name: "Saint Helena",
  },
  "sh-ta": {
    aspect: {
      "1x1": require("./flags/1x1/sh-ta.svg"),
      "4x3": require("./flags/4x3/sh-ta.svg"),
    },
    code: "sh-ta",
    iso: false,
    name: "Tristan da Cunha",
  },
  "si": {
    aspect: {
      "1x1": require("./flags/1x1/si.svg"),
      "4x3": require("./flags/4x3/si.svg"),
    },
    code: "si",
    iso: true,
    name: "Slovenia",
  },
  "sj": {
    aspect: {
      "1x1": require("./flags/1x1/sj.svg"),
      "4x3": require("./flags/4x3/sj.svg"),
    },
    code: "sj",
    iso: true,
    name: "Svalbard and Jan Mayen",
  },
  "sk": {
    aspect: {
      "1x1": require("./flags/1x1/sk.svg"),
      "4x3": require("./flags/4x3/sk.svg"),
    },
    code: "sk",
    iso: true,
    name: "Slovakia",
  },
  "sl": {
    aspect: {
      "1x1": require("./flags/1x1/sl.svg"),
      "4x3": require("./flags/4x3/sl.svg"),
    },
    code: "sl",
    iso: true,
    name: "Sierra Leone",
  },
  "sm": {
    aspect: {
      "1x1": require("./flags/1x1/sm.svg"),
      "4x3": require("./flags/4x3/sm.svg"),
    },
    code: "sm",
    iso: true,
    name: "San Marino",
  },
  "sn": {
    aspect: {
      "1x1": require("./flags/1x1/sn.svg"),
      "4x3": require("./flags/4x3/sn.svg"),
    },
    code: "sn",
    iso: true,
    name: "Senegal",
  },
  "so": {
    aspect: {
      "1x1": require("./flags/1x1/so.svg"),
      "4x3": require("./flags/4x3/so.svg"),
    },
    code: "so",
    iso: true,
    name: "Somalia",
  },
  "sr": {
    aspect: {
      "1x1": require("./flags/1x1/sr.svg"),
      "4x3": require("./flags/4x3/sr.svg"),
    },
    code: "sr",
    iso: true,
    name: "Suriname",
  },
  "ss": {
    aspect: {
      "1x1": require("./flags/1x1/ss.svg"),
      "4x3": require("./flags/4x3/ss.svg"),
    },
    code: "ss",
    iso: true,
    name: "South Sudan",
  },
  "st": {
    aspect: {
      "1x1": require("./flags/1x1/st.svg"),
      "4x3": require("./flags/4x3/st.svg"),
    },
    code: "st",
    iso: true,
    name: "Sao Tome and Principe",
  },
  "sv": {
    aspect: {
      "1x1": require("./flags/1x1/sv.svg"),
      "4x3": require("./flags/4x3/sv.svg"),
    },
    code: "sv",
    iso: true,
    name: "El Salvador",
  },
  "sx": {
    aspect: {
      "1x1": require("./flags/1x1/sx.svg"),
      "4x3": require("./flags/4x3/sx.svg"),
    },
    code: "sx",
    iso: true,
    name: "Sint Maarten",
  },
  "sy": {
    aspect: {
      "1x1": require("./flags/1x1/sy.svg"),
      "4x3": require("./flags/4x3/sy.svg"),
    },
    code: "sy",
    iso: true,
    name: "Syria",
  },
  "sz": {
    aspect: {
      "1x1": require("./flags/1x1/sz.svg"),
      "4x3": require("./flags/4x3/sz.svg"),
    },
    code: "sz",
    iso: true,
    name: "Eswatini",
  },
  "tc": {
    aspect: {
      "1x1": require("./flags/1x1/tc.svg"),
      "4x3": require("./flags/4x3/tc.svg"),
    },
    code: "tc",
    iso: true,
    name: "Turks and Caicos Islands",
  },
  "td": {
    aspect: {
      "1x1": require("./flags/1x1/td.svg"),
      "4x3": require("./flags/4x3/td.svg"),
    },
    code: "td",
    iso: true,
    name: "Chad",
  },
  "tf": {
    aspect: {
      "1x1": require("./flags/1x1/tf.svg"),
      "4x3": require("./flags/4x3/tf.svg"),
    },
    code: "tf",
    iso: true,
    name: "French Southern Territories",
  },
  "tg": {
    aspect: {
      "1x1": require("./flags/1x1/tg.svg"),
      "4x3": require("./flags/4x3/tg.svg"),
    },
    code: "tg",
    iso: true,
    name: "Togo",
  },
  "th": {
    aspect: {
      "1x1": require("./flags/1x1/th.svg"),
      "4x3": require("./flags/4x3/th.svg"),
    },
    code: "th",
    iso: true,
    name: "Thailand",
  },
  "tj": {
    aspect: {
      "1x1": require("./flags/1x1/tj.svg"),
      "4x3": require("./flags/4x3/tj.svg"),
    },
    code: "tj",
    iso: true,
    name: "Tajikistan",
  },
  "tk": {
    aspect: {
      "1x1": require("./flags/1x1/tk.svg"),
      "4x3": require("./flags/4x3/tk.svg"),
    },
    code: "tk",
    iso: true,
    name: "Tokelau",
  },
  "tl": {
    aspect: {
      "1x1": require("./flags/1x1/tl.svg"),
      "4x3": require("./flags/4x3/tl.svg"),
    },
    code: "tl",
    iso: true,
    name: "Timor-Leste",
  },
  "tm": {
    aspect: {
      "1x1": require("./flags/1x1/tm.svg"),
      "4x3": require("./flags/4x3/tm.svg"),
    },
    code: "tm",
    iso: true,
    name: "Turkmenistan",
  },
  "tn": {
    aspect: {
      "1x1": require("./flags/1x1/tn.svg"),
      "4x3": require("./flags/4x3/tn.svg"),
    },
    code: "tn",
    iso: true,
    name: "Tunisia",
  },
  "to": {
    aspect: {
      "1x1": require("./flags/1x1/to.svg"),
      "4x3": require("./flags/4x3/to.svg"),
    },
    code: "to",
    iso: true,
    name: "Tonga",
  },
  "tr": {
    aspect: {
      "1x1": require("./flags/1x1/tr.svg"),
      "4x3": require("./flags/4x3/tr.svg"),
    },
    code: "tr",
    iso: true,
    name: "Türkiye",
  },
  "tt": {
    aspect: {
      "1x1": require("./flags/1x1/tt.svg"),
      "4x3": require("./flags/4x3/tt.svg"),
    },
    code: "tt",
    iso: true,
    name: "Trinidad and Tobago",
  },
  "tv": {
    aspect: {
      "1x1": require("./flags/1x1/tv.svg"),
      "4x3": require("./flags/4x3/tv.svg"),
    },
    code: "tv",
    iso: true,
    name: "Tuvalu",
  },
  "tw": {
    aspect: {
      "1x1": require("./flags/1x1/tw.svg"),
      "4x3": require("./flags/4x3/tw.svg"),
    },
    code: "tw",
    iso: true,
    name: "Taiwan",
  },
  "tz": {
    aspect: {
      "1x1": require("./flags/1x1/tz.svg"),
      "4x3": require("./flags/4x3/tz.svg"),
    },
    code: "tz",
    iso: true,
    name: "Tanzania",
  },
  "ua": {
    aspect: {
      "1x1": require("./flags/1x1/ua.svg"),
      "4x3": require("./flags/4x3/ua.svg"),
    },
    code: "ua",
    iso: true,
    name: "Ukraine",
  },
  "ug": {
    aspect: {
      "1x1": require("./flags/1x1/ug.svg"),
      "4x3": require("./flags/4x3/ug.svg"),
    },
    code: "ug",
    iso: true,
    name: "Uganda",
  },
  "um": {
    aspect: {
      "1x1": require("./flags/1x1/um.svg"),
      "4x3": require("./flags/4x3/um.svg"),
    },
    code: "um",
    iso: true,
    name: "United States Minor Outlying Islands",
  },
  "un": {
    aspect: {
      "1x1": require("./flags/1x1/un.svg"),
      "4x3": require("./flags/4x3/un.svg"),
    },
    code: "un",
    iso: false,
    name: "United Nations",
  },
  "us": {
    aspect: {
      "1x1": require("./flags/1x1/us.svg"),
      "4x3": require("./flags/4x3/us.svg"),
    },
    code: "us",
    iso: true,
    name: "United States of America",
  },
  "uy": {
    aspect: {
      "1x1": require("./flags/1x1/uy.svg"),
      "4x3": require("./flags/4x3/uy.svg"),
    },
    code: "uy",
    iso: true,
    name: "Uruguay",
  },
  "uz": {
    aspect: {
      "1x1": require("./flags/1x1/uz.svg"),
      "4x3": require("./flags/4x3/uz.svg"),
    },
    code: "uz",
    iso: true,
    name: "Uzbekistan",
  },
  "va": {
    aspect: {
      "1x1": require("./flags/1x1/va.svg"),
      "4x3": require("./flags/4x3/va.svg"),
    },
    code: "va",
    iso: true,
    name: "Holy See",
  },
  "vc": {
    aspect: {
      "1x1": require("./flags/1x1/vc.svg"),
      "4x3": require("./flags/4x3/vc.svg"),
    },
    code: "vc",
    iso: true,
    name: "Saint Vincent and the Grenadines",
  },
  "ve": {
    aspect: {
      "1x1": require("./flags/1x1/ve.svg"),
      "4x3": require("./flags/4x3/ve.svg"),
    },
    code: "ve",
    iso: true,
    name: "Venezuela",
  },
  "vg": {
    aspect: {
      "1x1": require("./flags/1x1/vg.svg"),
      "4x3": require("./flags/4x3/vg.svg"),
    },
    code: "vg",
    iso: true,
    name: "Virgin Islands (British)",
  },
  "vi": {
    aspect: {
      "1x1": require("./flags/1x1/vi.svg"),
      "4x3": require("./flags/4x3/vi.svg"),
    },
    code: "vi",
    iso: true,
    name: "Virgin Islands (U.S.)",
  },
  "vn": {
    aspect: {
      "1x1": require("./flags/1x1/vn.svg"),
      "4x3": require("./flags/4x3/vn.svg"),
    },
    code: "vn",
    iso: true,
    name: "Vietnam",
  },
  "vu": {
    aspect: {
      "1x1": require("./flags/1x1/vu.svg"),
      "4x3": require("./flags/4x3/vu.svg"),
    },
    code: "vu",
    iso: true,
    name: "Vanuatu",
  },
  "wf": {
    aspect: {
      "1x1": require("./flags/1x1/wf.svg"),
      "4x3": require("./flags/4x3/wf.svg"),
    },
    code: "wf",
    iso: true,
    name: "Wallis and Futuna",
  },
  "ws": {
    aspect: {
      "1x1": require("./flags/1x1/ws.svg"),
      "4x3": require("./flags/4x3/ws.svg"),
    },
    code: "ws",
    iso: true,
    name: "Samoa",
  },
  "xk": {
    aspect: {
      "1x1": require("./flags/1x1/xk.svg"),
      "4x3": require("./flags/4x3/xk.svg"),
    },
    code: "xk",
    iso: false,
    name: "Kosovo",
  },
  "xx": {
    aspect: {
      "1x1": require("./flags/1x1/xx.svg"),
      "4x3": require("./flags/4x3/xx.svg"),
    },
    code: "xx",
    iso: false,
    name: "Unknown",
  },
  "ye": {
    aspect: {
      "1x1": require("./flags/1x1/ye.svg"),
      "4x3": require("./flags/4x3/ye.svg"),
    },
    code: "ye",
    iso: true,
    name: "Yemen",
  },
  "yt": {
    aspect: {
      "1x1": require("./flags/1x1/yt.svg"),
      "4x3": require("./flags/4x3/yt.svg"),
    },
    code: "yt",
    iso: true,
    name: "Mayotte",
  },
  "za": {
    aspect: {
      "1x1": require("./flags/1x1/za.svg"),
      "4x3": require("./flags/4x3/za.svg"),
    },
    code: "za",
    iso: true,
    name: "South Africa",
  },
  "zm": {
    aspect: {
      "1x1": require("./flags/1x1/zm.svg"),
      "4x3": require("./flags/4x3/zm.svg"),
    },
    code: "zm",
    iso: true,
    name: "Zambia",
  },
  "zw": {
    aspect: {
      "1x1": require("./flags/1x1/zw.svg"),
      "4x3": require("./flags/4x3/zw.svg"),
    },
    code: "zw",
    iso: true,
    name: "Zimbabwe",
  },
} satisfies Record<string, FlagAssetDefinition>;

export type FlagCode = keyof typeof flagAssetRegistry;

export const flagAssetCodes = Object.keys(flagAssetRegistry) as FlagCode[];

export const flagAssetSource = {
  attributionRequired: false,
  coverage: {
    assets: 271,
    isoCountriesAndTerritories: 249,
  },
  license: 'MIT',
  licenseUrl: 'https://github.com/lipis/flag-icons/blob/main/LICENSE',
  name: 'flag-icons',
  package: 'flag-icons',
  sourceUrl: 'https://github.com/lipis/flag-icons',
  version: '7.5.0',
} as const;
