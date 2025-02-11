import {StandardApi} from './api/standard/standard-api';
import {SmartGridApi, NavigationApi, ScannerApi} from './api';
import {RenderExtension} from './extension';
import type {Components} from './shared';
import {AnyComponentBuilder} from '../../shared';

type SmartGridComponents = AnyComponentBuilder<Pick<Components, 'Tile'>>;
type BasicComponents = AnyComponentBuilder<Omit<Components, 'Tile'>>;

export interface ExtensionTargets {
  'pos.home.tile.render': RenderExtension<
    StandardApi<'pos.home.tile.render'> & SmartGridApi,
    SmartGridComponents
  >;
  'pos.home.modal.render': RenderExtension<
    StandardApi<'pos.home.modal.render'> & NavigationApi & ScannerApi,
    BasicComponents
  >;
}

export type ExtensionTarget = keyof ExtensionTargets;

export type ExtensionForExtensionTarget<T extends ExtensionTarget> =
  ExtensionTargets[T];

/**
 * For a given extension target, returns the value that is expected to be
 * returned by that extension target’s callback type.
 */
export type ReturnTypeForExtension<ID extends keyof ExtensionTargets> =
  ReturnType<ExtensionTargets[ID]>;

/**
 * For a given extension target, returns the tuple of arguments that would
 * be provided to that extension target’s callback type.
 */
export type ArgumentsForExtension<ID extends keyof ExtensionTargets> =
  Parameters<ExtensionTargets[ID]>;

/**
 * A union type containing all of the extension targets that follow the pattern of
 * accepting a [`@remote-ui/core` `RemoteRoot`](https://github.com/Shopify/remote-ui/tree/main/packages/core)
 * and an additional `api` argument, and using those arguments to render
 * UI.
 */
export type RenderExtensionTarget = {
  [ID in keyof ExtensionTargets]: ExtensionTargets[ID] extends RenderExtension<
    any,
    any
  >
    ? ID
    : never;
}[keyof ExtensionTargets];

/**
 * A mapping of each “render extension” name to its callback type.
 */
export type RenderExtensions = {
  [ID in RenderExtensionTarget]: ExtensionTargets[ID];
};

type ExtractedApiFromRenderExtension<T> = T extends RenderExtension<
  infer Api,
  any
>
  ? Api
  : never;

type ExtractedAllowedComponentsFromRenderExtension<T> =
  T extends RenderExtension<any, infer Components> ? Components : never;

/**
 * For a given rendering extension target, returns the type of the API that the
 * extension will receive at runtime. This API type is the second argument to
 * the callback for that extension target. The first callback for all of the rendering
 * extension targets each receive a `RemoteRoot` object.
 */
export type ApiForRenderExtension<ID extends keyof RenderExtensions> =
  ExtractedApiFromRenderExtension<RenderExtensions[ID]>;

/**
 * For a given rendering extension target, returns the UI components that the
 * extension target supports.
 */
export type AllowedComponentsForRenderExtension<
  ID extends keyof RenderExtensions,
> = ExtractedAllowedComponentsFromRenderExtension<RenderExtensions[ID]>;
