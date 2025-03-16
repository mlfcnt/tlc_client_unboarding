export type Verification = {
  status: string;
  strategy: string;
  externalVerificationRedirectURL: string | null;
  attempts: number | null;
  expireAt: number | null;
  nonce: string | null;
  message: string | null;
};

export type LinkedTo = {
  id: string;
  type: string;
};

export type EmailAddress = {
  id: string;
  emailAddress: string;
  verification: Verification;
  linkedTo: LinkedTo[];
};

export type PhoneNumber = {
  id: string;
  phoneNumber: string;
  verification: Verification;
};

export type Web3Wallet = {
  id: string;
  web3Wallet: string;
  verification: Verification;
};

export type ExternalAccount = {
  id: string;
  provider: string;
  identificationId: string;
  externalId: string;
  approvedScopes: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  username: string | null;
  publicMetadata: Record<string, unknown>;
  label: string | null;
  verification: Verification;
};

export type SamlAccount = {
  id: string;
  provider: string;
};

export type RawGoogleAccount = {
  object: string;
  id: string;
  provider: string;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  image_url: string;
  username: string | null;
  public_metadata: Record<string, unknown>;
  label: string | null;
  created_at: number;
  updated_at: number;
  verification: Verification;
  external_account_id: string;
  google_id: string;
  given_name: string;
  family_name: string;
  picture: string;
};

export type RawClerkUser = {
  id: string;
  object: string;
  username: string | null;
  first_name: string;
  last_name: string;
  image_url: string;
  has_image: boolean;
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  email_addresses: {
    id: string;
    object: string;
    email_address: string;
    reserved: boolean;
    verification: {
      status: string;
      strategy: string;
      attempts: number | null;
      expire_at: number | null;
    };
    linked_to: {
      type: string;
      id: string;
    }[];
    matches_sso_connection: boolean;
    created_at: number;
    updated_at: number;
  }[];
  phone_numbers: PhoneNumber[];
  web3_wallets: Web3Wallet[];
  passkeys: unknown[];
  external_accounts: RawGoogleAccount[];
  saml_accounts: SamlAccount[];
  enterprise_accounts: unknown[];
  public_metadata: {
    role: string;
  };
  private_metadata: Record<string, unknown>;
  unsafe_metadata: Record<string, unknown>;
  external_id: string | null;
  last_sign_in_at: number;
  banned: boolean;
  locked: boolean;
  lockout_expires_in_seconds: number | null;
  verification_attempts_remaining: number;
  created_at: number;
  updated_at: number;
  delete_self_enabled: boolean;
  create_organization_enabled: boolean;
  last_active_at: number;
  mfa_enabled_at: number | null;
  mfa_disabled_at: number | null;
  legal_accepted_at: number | null;
  profile_image_url: string;
};

export type ClerkUser = {
  id: string;
  passwordEnabled: boolean;
  totpEnabled: boolean;
  backupCodeEnabled: boolean;
  twoFactorEnabled: boolean;
  banned: boolean;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
  imageUrl: string;
  hasImage: boolean;
  primaryEmailAddressId: string;
  primaryPhoneNumberId: string | null;
  primaryWeb3WalletId: string | null;
  lastSignInAt: number;
  externalId: string | null;
  username: string | null;
  firstName: string;
  lastName: string;
  publicMetadata: {
    role: string;
  };
  privateMetadata: Record<string, unknown>;
  unsafeMetadata: Record<string, unknown>;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  web3Wallets: Web3Wallet[];
  externalAccounts: ExternalAccount[];
  samlAccounts: SamlAccount[];
  lastActiveAt: number;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit: number | null;
  deleteSelfEnabled: boolean;
  legalAcceptedAt: number | null;
  _raw: RawClerkUser;
};
