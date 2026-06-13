import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

function defineDocument<TData, TVariables extends object>(source: string) {
  return source as unknown as TypedDocumentNode<TData, TVariables>;
}

export type User = {
  id: string;
  email: string;
  displayName?: string | null;
  createdAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

export type ValidationErrorPayload = {
  code: string;
  message: string;
  fieldErrors?: { field: string; message: string }[] | null;
};

export type Category = {
  id: string;
  name: string;
  isDefault: boolean;
  lowStockThreshold: number;
};

export type BoxQuantity = {
  box: string;
  quantity: number;
};

export type Component = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  lowStockThreshold: number;
  datasheetUrl?: string | null;
  totalQty: number;
  boxQuantities: BoxQuantity[];
  updatedAt: string;
};

export type ComponentConnection = {
  items: Component[];
  totalCount: number;
  limit: number;
  offset: number;
};

export type InventoryLogType =
  | "ADD_STOCK"
  | "USE"
  | "RETURN"
  | "LOST"
  | "BURN"
  | "DEFECTIVE"
  | "REALLOCATE";

export type InventoryLog = {
  id: string;
  componentId: string;
  componentName?: string | null;
  type: InventoryLogType;
  quantity: number;
  box: string;
  fromBox?: string | null;
  reason?: string | null;
  relatedLogId?: string | null;
  createdAt: string;
};

export type InventoryLogConnection = {
  items: InventoryLog[];
  totalCount: number;
  limit: number;
  offset: number;
};

export const REGISTER_MUTATION = defineDocument<
  { register: AuthPayload | ValidationErrorPayload },
  { input: { email: string; password: string; displayName?: string | null } }
>(`
  mutation Register($input: RegisterInputGQL!) {
    register(input: $input) {
      ... on AuthPayload {
        token
        user {
          id
          email
          displayName
        }
      }
      ... on ValidationErrorType {
        code
        message
        fieldErrors {
          field
          message
        }
      }
    }
  }
`);

export const LOGIN_MUTATION = defineDocument<
  { login: AuthPayload | ValidationErrorPayload },
  { input: { email: string; password: string } }
>(`
  mutation Login($input: LoginInputGQL!) {
    login(input: $input) {
      ... on AuthPayload {
        token
        user {
          id
          email
          displayName
        }
      }
      ... on ValidationErrorType {
        code
        message
      }
    }
  }
`);

export const ME_QUERY = defineDocument<{ me: User | null }, Record<string, never>>(`
  query Me {
    me {
      id
      email
      displayName
      createdAt
    }
  }
`);

export const CATEGORIES_QUERY = defineDocument<
  { categories: Category[] },
  Record<string, never>
>(`
  query Categories {
    categories {
      id
      name
      isDefault
      lowStockThreshold
    }
  }
`);

export const CREATE_CATEGORY_MUTATION = defineDocument<
  { createCategory: Category | ValidationErrorPayload },
  { input: { name: string; lowStockThreshold?: number } }
>(`
  mutation CreateCategory($input: CreateCategoryInputGQL!) {
    createCategory(input: $input) {
      ... on CategoryType {
        id
        name
        isDefault
        lowStockThreshold
      }
      ... on ValidationErrorType {
        code
        message
        fieldErrors {
          field
          message
        }
      }
    }
  }
`);

export const UPDATE_CATEGORY_MUTATION = defineDocument<
  { updateCategory: Category | ValidationErrorPayload },
  {
    input: {
      id: string;
      name?: string | null;
      lowStockThreshold?: number | null;
    };
  }
>(`
  mutation UpdateCategory($input: UpdateCategoryInputGQL!) {
    updateCategory(input: $input) {
      ... on CategoryType {
        id
        name
        isDefault
        lowStockThreshold
      }
      ... on ValidationErrorType {
        code
        message
        fieldErrors {
          field
          message
        }
      }
    }
  }
`);

export const COMPONENTS_QUERY = defineDocument<
  { components: ComponentConnection },
  {
    filter?: {
      search?: string | null;
      categoryId?: string | null;
      box?: string | null;
    } | null;
    pagination?: { limit?: number; offset?: number } | null;
  }
>(`
  query Components($filter: ComponentFilterInputGQL, $pagination: PaginationInputGQL) {
    components(filter: $filter, pagination: $pagination) {
      totalCount
      limit
      offset
      items {
        id
        name
        categoryName
        lowStockThreshold
        totalQty
        updatedAt
      }
    }
  }
`);

export const COMPONENT_QUERY = defineDocument<
  { component: Component | null },
  { id: string }
>(`
  query Component($id: ID!) {
    component(id: $id) {
      id
      name
      categoryId
      categoryName
      lowStockThreshold
      datasheetUrl
      totalQty
      updatedAt
      boxQuantities {
        box
        quantity
      }
    }
  }
`);

export const COMPONENT_LOGS_QUERY = defineDocument<
  { componentLogs: InventoryLogConnection },
  { componentId: string; pagination?: { limit?: number; offset?: number } | null }
>(`
  query ComponentLogs($componentId: ID!, $pagination: PaginationInputGQL) {
    componentLogs(componentId: $componentId, pagination: $pagination) {
      totalCount
      items {
        id
        type
        quantity
        box
        fromBox
        reason
        relatedLogId
        createdAt
      }
    }
  }
`);

export const INVENTORY_LOGS_QUERY = defineDocument<
  { inventoryLogs: InventoryLogConnection },
  {
    filter?: {
      search?: string | null;
      type?: InventoryLogType | null;
      box?: string | null;
      componentId?: string | null;
    } | null;
    pagination?: { limit?: number; offset?: number } | null;
  }
>(`
  query InventoryLogs($filter: InventoryLogFilterInputGQL, $pagination: PaginationInputGQL) {
    inventoryLogs(filter: $filter, pagination: $pagination) {
      totalCount
      limit
      offset
      items {
        id
        componentId
        componentName
        type
        quantity
        box
        fromBox
        reason
        createdAt
      }
    }
  }
`);

export const CREATE_COMPONENT_MUTATION = defineDocument<
  { createComponent: Component | ValidationErrorPayload },
  {
    input: {
      name: string;
      categoryId: string;
      datasheetUrl?: string | null;
      initialBoxQuantities?: { box: string; quantity: number }[] | null;
    };
  }
>(`
  mutation CreateComponent($input: CreateComponentInputGQL!) {
    createComponent(input: $input) {
      ... on ComponentType {
        id
        name
        totalQty
      }
      ... on ValidationErrorType {
        code
        message
      }
    }
  }
`);

export const UPDATE_COMPONENT_MUTATION = defineDocument<
  { updateComponent: Component | ValidationErrorPayload },
  {
    input: {
      id: string;
      name?: string | null;
      categoryId?: string | null;
      datasheetUrl?: string | null;
    };
  }
>(`
  mutation UpdateComponent($input: UpdateComponentInputGQL!) {
    updateComponent(input: $input) {
      ... on ComponentType {
        id
        name
        categoryId
        categoryName
        datasheetUrl
      }
      ... on ValidationErrorType {
        code
        message
      }
    }
  }
`);

export const APPLY_INVENTORY_LOG_MUTATION = defineDocument<
  {
    applyInventoryLog:
      | { log: InventoryLog; component: Component }
      | ValidationErrorPayload;
  },
  {
    input: {
      componentId: string;
      type: InventoryLogType;
      quantity: number;
      box: string;
      fromBox?: string | null;
      reason?: string | null;
      relatedLogId?: string | null;
    };
  }
>(`
  mutation ApplyInventoryLog($input: ApplyInventoryLogInputGQL!) {
    applyInventoryLog(input: $input) {
      ... on ApplyInventoryLogSuccess {
        log {
          id
          type
          quantity
          box
          fromBox
        }
        component {
          id
          totalQty
          boxQuantities {
            box
            quantity
          }
        }
      }
      ... on ValidationErrorType {
        code
        message
        fieldErrors {
          field
          message
        }
      }
    }
  }
`);
