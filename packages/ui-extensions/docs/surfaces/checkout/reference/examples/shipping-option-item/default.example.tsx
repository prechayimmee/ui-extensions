import {
  reactExtension,
  Text,
  useSubscription,
  useShippingOptionTarget,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.shipping-option-item.render-after',
  () => <Extension />,
);

function Extension() {
  const {shippingOptionTarget, isTargetSelected} =
    useShippingOptionTarget();
  const title = shippingOptionTarget.title;

  return (
    <Text>
      Shipping method: {title} is{' '}
      {isTargetSelected ? '' : 'not'} selected.
    </Text>
  );
}
