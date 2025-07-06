import React from 'React'

/**
 * 1. Add GLOBAL CSS files here. Typical candidates are:
 */
// import './app/globals.css'; // (This is NEXT.js default)
// import './index.css';
// import './styles.css';

/**
 * 2. Add providers here. For example:
 */
export default function Wrapper({children}: React.PropsWithChildren<{}>) {
  return (
    <>
      {/* You place global providers here, for example:*/}
      {/* <TanstackQueryProvider */}
      {/* <ContextProvider */}
      {/* <ThemeProvider */}
      {children}
      {/* </ThemeProvider */}
      {/* </ContextProvider */}
      {/* </TanstackQueryProvider */}
    </>
  )
}
