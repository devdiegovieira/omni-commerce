import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import { PaperBlock } from 'digi-components';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import messages from './messages';

function BlankPage(props) {
  const title = brand.name + ' - Blank Page';
  const description = brand.desc;
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
      <PaperBlock
        title={intl.formatMessage(messages.paperTitle)}
        icon="video_label"
        desc={intl.formatMessage(messages.paperSubtitle)}
      >
        <FormattedMessage {...messages.content} />
      </PaperBlock>
    </div>
  );
}

BlankPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(BlankPage);
