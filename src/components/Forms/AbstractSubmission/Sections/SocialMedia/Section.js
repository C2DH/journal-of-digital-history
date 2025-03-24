import React from 'react'
import FormAbstractSocialMedia from './Form'

const SocialMediaSection = ({ temporaryAbstractSubmission, handleChange, isPreviewMode }) => {
  const socialMedia = temporaryAbstractSubmission.socialMedia || {}

  return (
    <>
      <h3 className="progressiveHeading">Social Media</h3>
      {!isPreviewMode && (
        <FormAbstractSocialMedia
          initialValue={socialMedia}
          onChange={(field) => {
            // console.log("🚀 ~ file: Section.js:14 ~ field:", field)
            return handleChange({ ...field })}
          } 
        />
      )}
      {isPreviewMode && (
        <div>
          <p><strong>GitHub ID:</strong> {socialMedia.githubId || 'N/A'}</p>
          {/* Add more social media fields here if needed */}
        </div>
      )}
      <hr/>
    </>
  )
}

export default SocialMediaSection