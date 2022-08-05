import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import { Route } from 'react-router-dom';
import { ErrorWrap } from 'digi-components';
import { injectIntl, intlShape } from 'react-intl';

const title = brand.name + ' - Page Not Found';
const description = brand.desc;
const NotFound = (props) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = 404;
      }
      const { intl } = props;
      return (
        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
          </Helmet>
          <ErrorWrap desc={"Nossa página ainda está em construção!"} subtitle={"Não se preocupe! Em breve mais uma novidade irá decolar."} />
        </div>
      );
    }}
  />
);

NotFound.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(NotFound);
