import { FC, ReactElement, useMemo, cloneElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface IActiveLink extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

const ActiveLink: FC<IActiveLink> = ({
  children,
  activeClassName,
  ...rest
}) => {
  const { asPath } = useRouter();

  const className = useMemo(
    () => (asPath === rest.href ? activeClassName : ''),
    [activeClassName, asPath, rest.href],
  );

  const element = useMemo(
    () =>
      cloneElement(children, {
        className,
      }),
    [children, className],
  );

  return <Link {...rest}>{element}</Link>;
};

export default ActiveLink;
