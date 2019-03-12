import { tokenize } from "./tokenizer";
import {
  decodeFromHex,
  encodeToHex,
  hasSpecialCharacters,
  replaceAll
} from "./string";

// code to extract tags
// JSON.stringify(Array.prototype.slice.call(document.getElementsByClassName("post-tag")).map(e =>  e.innerHTML).reduce( (a, c) => ({...a, [c]: { tokens: [c] }}) , {}))

export function extractTags(content: string): Tag[] {
  let processedContent = content.toLowerCase();
  const encodedList: string[] = [];
  // encode
  for (let itemToEncode of listOfStuffToEncode) {
    if (processedContent.indexOf(itemToEncode) != -1) {
      const encoded = encodeToHex(itemToEncode);
      encodedList.push(encoded);
      processedContent = replaceAll(processedContent, itemToEncode, encoded);
    }
  }

  const tokens = tokenize(processedContent);
  // decode
  for (let i = 0; i < tokens.length; i++) {
    if (encodedList.includes(tokens[i])) {
      tokens[i] = decodeFromHex(tokens[i]);
    }
  }

  // extract
  const result = new Set<string>();
  for (let token of tokens) {
    for (let key in tagExtractionMap) {
      if (tagExtractionMap[key].tokens.includes(token)) {
        result.add(key);
      }
    }
  }
  return Array.from(result).map(i => ({
    name: i,
    priority: tagExtractionMap[i].priority
  }));
}

export interface Tag {
  name: string;
  priority?: number;
}

export interface Extractor {
  tokens: string[];
  priority?: number;
}

export type ExtractionMap = { [key: string]: Extractor };

const tagExtractionMap: ExtractionMap = {
  "ecmascript-6": { tokens: ["es6"] },
  "amazon-web-services": { tokens: ["aws"] },
  docker: { tokens: ["docker"] },
  postgresql: { tokens: ["postgresql", "postgres"] },
  java: { tokens: ["java"] },
  "node.js": { tokens: ["nodejs", "node"] },
  python: { tokens: ["python"] },
  javascript: { tokens: ["javascript"] },
  "vue.js": { tokens: ["vue", "vuejs"] },
  "c#": { tokens: ["c#"] },
  php: { tokens: ["php"] },
  jquery: { tokens: ["jquery"] },
  html: { tokens: ["html"] },
  "c++": { tokens: ["c++"] },
  ios: { tokens: ["ios"] },
  css: { tokens: ["css"] },
  mysql: { tokens: ["mysql"] },
  sql: { tokens: ["sql"] },
  "asp.net": { tokens: ["asp.net", "aspnet"] },
  "ruby-on-rails": { tokens: ["ruby-on-rails", "ruby on rails"] },
  c: { tokens: ["c"] },
  arrays: { tokens: ["arrays"] },
  "objective-c": { tokens: ["objective-c"] },
  ".net": { tokens: [".net", "dotnet"] },
  r: { tokens: ["r"] },
  angularjs: { tokens: ["angularjs"] },
  json: { tokens: ["json"] },
  swift: { tokens: ["swift"] },
  iphone: { tokens: ["iphone"] },
  regex: { tokens: ["regex"] },
  ruby: { tokens: ["ruby"] },
  ajax: { tokens: ["ajax"] },
  django: { tokens: ["django"] },
  excel: { tokens: ["excel"] },
  xml: { tokens: ["xml"] },
  "asp.net-mvc": { tokens: ["asp.net-mvc", "asp.net mvc"] },
  linux: { tokens: ["linux"] },
  spring: { tokens: ["spring"] },
  "python-3.x": { tokens: ["python-3.x"] },
  wpf: { tokens: ["wpf"] },
  wordpress: { tokens: ["wordpress"] },
  vba: { tokens: ["vba"] },
  string: { tokens: ["string"] },
  xcode: { tokens: ["xcode"] },
  windows: { tokens: ["windows"] },
  reactjs: { tokens: ["reactjs"] },
  "vb.net": { tokens: ["vb.net"] },
  html5: { tokens: ["html5"] },
  eclipse: { tokens: ["eclipse"] },
  multithreading: { tokens: ["multithreading"] },
  mongodb: { tokens: ["mongodb"] },
  laravel: { tokens: ["laravel"] },
  bash: { tokens: ["bash"] },
  git: { tokens: ["git"] },
  oracle: { tokens: ["oracle"] },
  pandas: { tokens: ["pandas"] },
  "twitter-bootstrap": { tokens: ["twitter-bootstrap"] },
  forms: { tokens: ["forms"] },
  image: { tokens: ["image"] },
  macos: { tokens: ["macos"] },
  algorithm: { tokens: ["algorithm"] },
  "python-2.7": { tokens: ["python-2.7"] },
  scala: { tokens: ["scala"] },
  "visual-studio": { tokens: ["visual-studio"] },
  list: { tokens: ["list"] },
  "excel-vba": { tokens: ["excel-vba"] },
  winforms: { tokens: ["winforms"] },
  apache: { tokens: ["apache"] },
  facebook: { tokens: ["facebook"] },
  matlab: { tokens: ["matlab"] },
  performance: { tokens: ["performance"] },
  css3: { tokens: ["css3"] },
  "entity-framework": { tokens: ["entity-framework"] },
  hibernate: { tokens: ["hibernate"] },
  typescript: { tokens: ["typescript"] },
  linq: { tokens: ["linq"] },
  swing: { tokens: ["swing"] },
  function: { tokens: ["function"] },
  qt: { tokens: ["qt"] },
  rest: { tokens: ["rest"] },
  shell: { tokens: ["shell"] },
  firebase: { tokens: ["firebase"] },
  api: { tokens: ["api"] },
  maven: { tokens: ["maven"] },
  powershell: { tokens: ["powershell"] },
  ".htaccess": { tokens: [".htaccess"] },
  sqlite: { tokens: ["sqlite"] },
  file: { tokens: ["file"] },
  codeigniter: { tokens: ["codeigniter"] },
  "unit-testing": { tokens: ["unit-testing"] },
  perl: { tokens: ["perl"] },
  loops: { tokens: ["loops"] },
  symfony: { tokens: ["symfony"] },
  selenium: { tokens: ["selenium"] },
  csv: { tokens: ["csv"] },
  "google-maps": { tokens: ["google-maps"] },
  uitableview: { tokens: ["uitableview"] },
  "web-services": { tokens: ["web-services"] },
  cordova: { tokens: ["cordova"] },
  class: { tokens: ["class"] },
  numpy: { tokens: ["numpy"] },
  tsql: { tokens: ["tsql"] },
  "ruby-on-rails-3": { tokens: ["ruby-on-rails-3"] },
  sorting: { tokens: ["sorting"] },
  validation: { tokens: ["validation"] },
  date: { tokens: ["date"] },
  sockets: { tokens: ["sockets"] },
  "spring-boot": { tokens: ["spring-boot"] },
  "sql-server-2008": { tokens: ["sql-server-2008"] },
  xaml: { tokens: ["xaml"] },
  http: { tokens: ["http"] },
  "spring-mvc": { tokens: ["spring-mvc"] },
  express: { tokens: ["express"] },
  email: { tokens: ["email"] },
  wcf: { tokens: ["wcf"] },
  jsp: { tokens: ["jsp"] },
  opencv: { tokens: ["opencv"] },
  "apache-spark": { tokens: ["apache-spark"] },
  listview: { tokens: ["listview"] },
  "react-native": { tokens: ["react-native"] },
  datetime: { tokens: ["datetime"] },
  oop: { tokens: ["oop"] },
  security: { tokens: ["security"] },
  "c++11": { tokens: ["c++11"] },
  "visual-studio-2010": { tokens: ["visual-studio-2010"] },
  parsing: { tokens: ["parsing"] },
  dataframe: { tokens: ["dataframe"] },
  dictionary: { tokens: ["dictionary"] },
  "user-interface": { tokens: ["user-interface"] },
  ubuntu: { tokens: ["ubuntu"] },
  "batch-file": { tokens: ["batch-file"] },
  object: { tokens: ["object"] },
  delphi: { tokens: ["delphi"] },
  "for-loop": { tokens: ["for-loop"] },
  "google-app-engine": { tokens: ["google-app-engine"] },
  "google-cloud-platform": { tokens: ["google-cloud-platform"] },
  pointers: { tokens: ["pointers"] },
  templates: { tokens: ["templates"] },
  "ms-access": { tokens: ["ms-access"] },
  "asp.net-mvc-4": { tokens: ["asp.net-mvc-4"] },
  variables: { tokens: ["variables"] },
  debugging: { tokens: ["debugging"] },
  actionscript: { tokens: ["actionscript"] },
  "actionscript-3": { tokens: ["actionscript-3"] },
  unix: { tokens: ["unix"] },
  "if-statement": { tokens: ["if-statement"] },
  unity3d: { tokens: ["unity3d"] },
  haskell: { tokens: ["haskell"] },
  session: { tokens: ["session"] },
  hadoop: { tokens: ["hadoop"] },
  tensorflow: { tokens: ["tensorflow"] },
  authentication: { tokens: ["authentication"] },
  "jquery-ui": { tokens: ["jquery-ui"] },
  "asp.net-mvc-3": { tokens: ["asp.net-mvc-3"] },
  pdf: { tokens: ["pdf"] },
  cocoa: { tokens: ["cocoa"] },
  ssl: { tokens: ["ssl"] },
  tomcat: { tokens: ["tomcat"] },
  "internet-explorer": { tokens: ["internet-explorer"] },
  magento: { tokens: ["magento"] },
  jpa: { tokens: ["jpa"] },
  elasticsearch: { tokens: ["elasticsearch"] },
  generics: { tokens: ["generics"] },
  matplotlib: { tokens: ["matplotlib"] },
  web: { tokens: ["web"] },
  go: { tokens: ["go"] },
  "ruby-on-rails-4": { tokens: ["ruby-on-rails-4"] },
  url: { tokens: ["url"] },
  xamarin: { tokens: ["xamarin"] },
  animation: { tokens: ["animation"] },
  flash: { tokens: ["flash"] },
  asynchronous: { tokens: ["asynchronous"] },
  nginx: { tokens: ["nginx"] },
  "cocoa-touch": { tokens: ["cocoa-touch"] },
  ipad: { tokens: ["ipad"] }
};

// build list of stuff to encode
const listOfStuffToEncode: string[] = [];
for (let tag in tagExtractionMap) {
  for (let token of tagExtractionMap[tag].tokens) {
    if (hasSpecialCharacters(token)) {
      listOfStuffToEncode.push(token);
    }
  }
}
