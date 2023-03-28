declare module "process" {
  global {
    namespace NodeJS {
      //配置后会把值注入到业务代码里面去，webpack解析代码匹配到process.env.BASE_ENV，就会设置到对应的值
      export interface ProcessEnv {
        BASE_ENV: "development" | "test" | "pre" | "production";
        NODE_ENV: "development" | "production";
      }
    }
  }
}
