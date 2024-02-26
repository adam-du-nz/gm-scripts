import type { Metadata } from "../esbuild.plugin/metadata";
import faviconPath from "./assets/filter_aws_sso_accounts.favicon.svg";
import { version, repository, description } from "../package.json";

const author: Metadata.Author = {
  name: "Adam Du",
  email: "git@adamdu.nz",
};

const metadata: Metadata = {
  name: "Filter AWS SSO Accounts",
  description: description,
  namespace: repository.url,
  author,
  version,
  grant: "none",
  match: "https://myob-technology.awsapps.com/start*",
  icon: faviconPath,
  resource: {
    icon: faviconPath,
  },
};

export default metadata;
