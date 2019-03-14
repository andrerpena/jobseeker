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

  const tokens = [...new Set<string>(tokenize(processedContent))];
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
      if (
        tagExtractionMap[key].tokens.includes(token) ||
        tagExtractionMap[key].tokens.includes(replaceAll(token, " ", "-"))
      ) {
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
  "objective-c": { tokens: ["objective-c", "objective c"] },
  ".net": { tokens: [".net", "dotnet"] },
  r: { tokens: ["r"] },
  angularjs: { tokens: ["angularjs", "angular"] },
  swift: { tokens: ["swift"] },
  iphone: { tokens: ["iphone"] },
  regex: { tokens: ["regex"] },
  ruby: { tokens: ["ruby"] },
  ajax: { tokens: ["ajax"] },
  django: { tokens: ["django"] },
  excel: { tokens: ["excel"] },
  xml: { tokens: ["xml"] },
  "asp.net-mvc": { tokens: ["asp.net-mvc"] },
  linux: { tokens: ["linux"] },
  spring: { tokens: ["spring"] },
  wpf: { tokens: ["wpf"] },
  wordpress: { tokens: ["wordpress"] },
  vba: { tokens: ["vba"] },
  xcode: { tokens: ["xcode"] },
  windows: { tokens: ["windows"] },
  reactjs: { tokens: ["reactjs", "react"] },
  "vb.net": { tokens: ["vb.net"] },
  html5: { tokens: ["html5"] },
  mongodb: { tokens: ["mongodb"] },
  laravel: { tokens: ["laravel"] },
  bash: { tokens: ["bash"] },
  git: { tokens: ["git"] },
  oracle: { tokens: ["oracle"] },
  pandas: { tokens: ["pandas"] },
  "twitter-bootstrap": { tokens: ["twitter-bootstrap"] },
  macos: { tokens: ["macos"] },
  algorithm: { tokens: ["algorithm"] },
  scala: { tokens: ["scala"] },
  "visual-studio": { tokens: ["visual-studio"] },
  "excel-vba": { tokens: ["excel-vba"] },
  winforms: { tokens: ["winforms", "windows-forms"] },
  apache: { tokens: ["apache"] },
  facebook: { tokens: ["facebook"] },
  matlab: { tokens: ["matlab"] },
  performance: { tokens: ["performance"] },
  css3: { tokens: ["css3", "css-3"] },
  "entity-framework": { tokens: ["entity-framework"] },
  hibernate: { tokens: ["hibernate"] },
  typescript: { tokens: ["typescript"] },
  linq: { tokens: ["linq"] },
  swing: { tokens: ["swing"] },
  function: { tokens: ["function"] },
  qt: { tokens: ["qt"] },
  firebase: { tokens: ["firebase"] },
  api: { tokens: ["api"] },
  maven: { tokens: ["maven"] },
  powershell: { tokens: ["powershell"] },
  sqlite: { tokens: ["sqlite"] },
  codeigniter: { tokens: ["codeigniter", "code-igniter"] },
  "unit-testing": { tokens: ["unit-testing", "unit-tests", "unit-test"] },
  perl: { tokens: ["perl"] },
  symfony: { tokens: ["symfony"] },
  selenium: { tokens: ["selenium"] },
  "google-maps": { tokens: ["google-maps"] },
  "web-services": { tokens: ["web-services"] },
  cordova: { tokens: ["cordova"] },
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
  "react-native": { tokens: ["react-native", "reactnative"] },
  oop: { tokens: ["oop", "object oriented programming"] },
  security: { tokens: ["security"] },
  "c++11": { tokens: ["c++11"] },
  "visual-studio-2010": { tokens: ["visual-studio-2010"] },
  ubuntu: { tokens: ["ubuntu"] },
  "batch-file": { tokens: ["batch-file"] },
  object: { tokens: ["object"] },
  delphi: { tokens: ["delphi"] },
  "google-app-engine": { tokens: ["google-app-engine"] },
  "google-cloud-platform": { tokens: ["google-cloud-platform"] },
  "ms-access": { tokens: ["ms-access"] },
  actionscript: { tokens: ["actionscript"] },
  unix: { tokens: ["unix"] },
  unity3d: { tokens: ["unity3d", "unity"] },
  haskell: { tokens: ["haskell"] },
  hadoop: { tokens: ["hadoop"] },
  tensorflow: { tokens: ["tensorflow"] },
  "asp.net-mvc-3": { tokens: ["asp.net-mvc-3"] },
  pdf: { tokens: ["pdf"] },
  cocoa: { tokens: ["cocoa"] },
  ssl: { tokens: ["ssl"] },
  tomcat: { tokens: ["tomcat"] },
  "internet-explorer": { tokens: ["internet-explorer"] },
  magento: { tokens: ["magento"] },
  jpa: { tokens: ["jpa"] },
  elasticsearch: { tokens: ["elasticsearch"] },
  matplotlib: { tokens: ["matplotlib"] },
  web: { tokens: ["web"] },
  go: { tokens: ["golang"] },
  url: { tokens: ["url"] },
  xamarin: { tokens: ["xamarin"] },
  animation: { tokens: ["animation"] },
  flash: { tokens: ["flash"] },
  asynchronous: { tokens: ["asynchronous"] },
  nginx: { tokens: ["nginx"] },
  "cocoa-touch": { tokens: ["cocoa-touch"] },
  curl: { tokens: ["curl"] },
  testing: { tokens: ["testing"] },
  firefox: { tokens: ["firefox"] },
  jenkins: { tokens: ["jenkins"] },
  jsf: { tokens: ["jsf"] },
  redirect: { tokens: ["redirect"] },
  inheritance: { tokens: ["inheritance"] },
  "ionic-framework": { tokens: ["ionic-framework", "ionic"] },
  winapi: { tokens: ["winapi"] },
  "facebook-graph-api": { tokens: ["facebook-graph-api"] },
  post: { tokens: ["post"] },
  exception: { tokens: ["exception"] },
  "d3.js": { tokens: ["d3.js", "d3"] },
  recursion: { tokens: ["recursion"] },
  opengl: { tokens: ["opengl"] },
  math: { tokens: ["math"] },
  xslt: { tokens: ["xslt"] },
  events: { tokens: ["events"] },
  join: { tokens: ["join"] },
  "selenium-webdriver": { tokens: ["selenium-webdriver"] },
  dom: { tokens: ["dom"] },
  "laravel-5": { tokens: ["laravel-5"] },
  gradle: { tokens: ["gradle"] },
  select: { tokens: ["select"] },
  iis: { tokens: ["iis"] },
  button: { tokens: ["button"] },
  gcc: { tokens: ["gcc"] },
  servlets: { tokens: ["servlets"] },
  "asp.net-web-api": { tokens: ["asp.net-web-api"] },
  "image-processing": { tokens: ["image-processing"] },
  svg: { tokens: ["svg"] },
  search: { tokens: ["search"] },
  heroku: { tokens: ["heroku"] },
  logging: { tokens: ["logging"] },
  assembly: { tokens: ["assembly"] },
  "mod-rewrite": { tokens: ["mod-rewrite"] },
  "stored-procedures": { tokens: ["stored-procedures"] },
  cakephp: { tokens: ["cakephp"] },
  matrix: { tokens: ["matrix"] },
  "intellij-idea": { tokens: ["intellij-idea"] },
  networking: { tokens: ["networking"] },
  "machine-learning": { tokens: ["machine-learning"] },
  javafx: { tokens: ["javafx"] },
  xpath: { tokens: ["xpath"] },
  encryption: { tokens: ["encryption"] },
  "java-ee": { tokens: ["java-ee"] },
  grails: { tokens: ["grails"] },
  video: { tokens: ["video"] },
  memory: { tokens: ["memory"] },
  meteor: { tokens: ["meteor"] },
  "asp.net-core": { tokens: ["asp.net-core"] },
  "amazon-s3": { tokens: ["amazon-s3"] },
  razor: { tokens: ["razor"] },
  cookies: { tokens: ["cookies"] },
  iframe: { tokens: ["iframe"] },
  silverlight: { tokens: ["silverlight"] },
  arraylist: { tokens: ["arraylist"] },
  mysqli: { tokens: ["mysqli"] },
  jdbc: { tokens: ["jdbc"] },
  ggplot2: { tokens: ["ggplot2"] },
  "visual-c++": { tokens: ["visual-c++"] },
  flask: { tokens: ["flask"] },
  serialization: { tokens: ["serialization"] },
  "design-patterns": { tokens: ["design-patterns"] },
  "multidimensional-array": { tokens: ["multidimensional-array"] },
  vector: { tokens: ["vector"] },
  activerecord: { tokens: ["activerecord"] },
  "core-data": { tokens: ["core-data"] },
  svn: { tokens: ["svn"] },
  gridview: { tokens: ["gridview"] },
  "c#-4.0": { tokens: ["c#-4.0"] },
  "firebase-realtime-database": { tokens: ["firebase-realtime-database"] },
  npm: { tokens: ["npm"] },
  checkbox: { tokens: ["checkbox"] },
  plot: { tokens: ["plot"] },
  webpack: { tokens: ["webpack"] },
  soap: { tokens: ["soap"] },
  input: { tokens: ["input"] },
  mobile: { tokens: ["mobile"] },
  mongoose: { tokens: ["mongoose"] },
  text: { tokens: ["text"] },
  sharepoint: { tokens: ["sharepoint"] },
  flex: { tokens: ["flex"] },
  indexing: { tokens: ["indexing"] },
  "amazon-ec2": { tokens: ["amazon-ec2"] },
  tkinter: { tokens: ["tkinter"] },
  mvvm: { tokens: ["mvvm"] },
  vim: { tokens: ["vim"] },
  "google-maps-api-3": { tokens: ["google-maps-api-3"] },
  awk: { tokens: ["awk"] },
  extjs: { tokens: ["extjs"] },
  boost: { tokens: ["boost"] },
  "file-upload": { tokens: ["file-upload"] },
  "memory-management": { tokens: ["memory-management"] },
  "google-apps-script": { tokens: ["google-apps-script"] },
  "django-models": { tokens: ["django-models"] },
  "visual-studio-2012": { tokens: ["visual-studio-2012"] },
  "ember.js": { tokens: ["ember.js"] },
  "data-structures": { tokens: ["data-structures"] },
  "jquery-mobile": { tokens: ["jquery-mobile"] },
  groovy: { tokens: ["groovy"] },
  dynamic: { tokens: ["dynamic"] },
  netbeans: { tokens: ["netbeans"] },
  struct: { tokens: ["struct"] },
  pdo: { tokens: ["pdo"] },
  "reporting-services": { tokens: ["reporting-services"] },
  ssh: { tokens: ["ssh"] },
  sed: { tokens: ["sed"] },
  lambda: { tokens: ["lambda"] },
  plugins: { tokens: ["plugins"] },
  "database-design": { tokens: ["database-design"] },
  reflection: { tokens: ["reflection"] },
  "web-scraping": { tokens: ["web-scraping"] },
  "backbone.js": { tokens: ["backbone.js"] },
  gwt: { tokens: ["gwt"] },
  graph: { tokens: ["graph"] },
  kotlin: { tokens: ["kotlin"] },
  "zend-framework": { tokens: ["zend-framework"] },
  replace: { tokens: ["replace"] },
  junit: { tokens: ["junit"] },
  charts: { tokens: ["charts"] },
  plsql: { tokens: ["plsql"] },
  "data-binding": { tokens: ["data-binding"] },
  highcharts: { tokens: ["highcharts"] },
  "windows-phone": { tokens: ["windows-phone"] },
  "spring-security": { tokens: ["spring-security"] },
  encoding: { tokens: ["encoding"] },
  "knockout.js": { tokens: ["knockout.js", "knockout"] },
  woocommerce: { tokens: ["woocommerce"] },
  tfs: { tokens: ["tfs"] },
  "visual-studio-2015": { tokens: ["visual-studio-2015"] },
  "web-applications": { tokens: ["web-applications"] },
  drupal: { tokens: ["drupal"] },
  "parse.com": { tokens: ["parse.com"] },
  "command-line": { tokens: ["command-line"] },
  types: { tokens: ["types"] },
  login: { tokens: ["login"] },
  "xamarin.forms": { tokens: ["xamarin.forms"] },
  "dependency-injection": { tokens: ["dependency-injection"] },
  "drop-down-menu": { tokens: ["drop-down-menu"] },
  "visual-studio-2013": { tokens: ["visual-studio-2013"] },
  deployment: { tokens: ["deployment"] },
  makefile: { tokens: ["makefile"] },
  "utf-8": { tokens: ["utf-8"] },
  printing: { tokens: ["printing"] },
  nhibernate: { tokens: ["nhibernate"] },
  "sql-server-2005": { tokens: ["sql-server-2005"] },
  swift3: { tokens: ["swift3"] },
  paypal: { tokens: ["paypal"] }
};

// build list of stuff to encode
const listOfStuffToEncode = new Set<string>();
for (let tag in tagExtractionMap) {
  for (let token of tagExtractionMap[tag].tokens) {
    const variations = new Set([token, replaceAll(token, "-", " ")]);
    for (let variation of variations) {
      if (hasSpecialCharacters(variation)) {
        listOfStuffToEncode.add(variation);
      }
    }
  }
}
