# Wistia uploading and playing components for AngularJS


Angular components that allow you to upload and play videos via Wistia. There are separate components to upload a video, show upload progress, show error messages and play an uploaded video. The multi-components architecture will support whatever fancy structure you are building.

Uploading works via [blueimp-file-upload](https://github.com/blueimp/jQuery-File-Upload).

## Get Started

Install via npm:

    npm install ng-wistia-components

## Usage

Every implementation begins with a parent component `ng-wistia`. Then, to customize your experience, you can choose among other child components: `ng-wistia-input`, `ng-wistia-progress`, `ng-wistia-error`, `ng-wistia-video`.

### Upload Video

To upload videos to Wistia, simply use the following setup:

    <ng-wistia api-password="************">
      <p>Choose a video.</p>

      <!-- action button for selecting a video to upload -->
      <ng-wistia-input></ng-wistia-input>

      <!-- any error messages from wistia's API Will be shown below -->
      <ng-wistia-error></ng-wistia-error>
    </ng-wistia>

### Upload and Play Video

The below implementation will do everything as the above, and **also** play the video that you just uploaded:

    <ng-wistia api-password="************">
      <p>Choose a video.</p>

      <!-- action button for selecting a video to upload -->
      <ng-wistia-input></ng-wistia-input>

      <!-- any error messages from wistia's API Will be shown below -->
      <ng-wistia-error></ng-wistia-error>

      <!-- uploaded video will play automatically -->
      <ng-wistia-video></ng-wistia-video>
    </ng-wistia>

### Upload, show upload progress, and Play Video

The below implementation will do everything as the above, and **also** show the a progress bar indicating the upload progress:

    <ng-wistia api-password="************">
      <p>Choose a video.</p>

      <!-- action button for selecting a video to upload -->
      <ng-wistia-input></ng-wistia-input>

      <!-- any error messages from wistia's API Will be shown below -->
      <ng-wistia-error></ng-wistia-error>

      <!-- upload progress -->
      <ng-wistia-progress></ng-wistia-progress>

      <!-- uploaded video will play automatically -->
      <ng-wistia-video></ng-wistia-video>
    </ng-wistia>

### Custom Implementation of Upload and Play

The below implementation will prompt the user to upload a video, and once uploaded, will change the UI to show a player. This is achieved via `ng-wistia-video`'s `on-play` attribute:

    <ng-wistia api-password="************">
      <div ng-if="!videoPlaying">
        <h1>Upload a Video</h1>
        <p>Choose a video that you wish to upload to Wistia. The upload will begin automatically.</p>
        <ng-wistia-input></ng-wistia-input>
        <ng-wistia-error></ng-wistia-error>
        <ng-wistia-progress></ng-wistia-progress>
      </div>

      <div ng-if="videoPlaying">
        <h1>Playing your Video</h1>
        <p>Your uploaded video has been embedded below. The playback should start automatically.</p>
      </div>
      
      <!-- when video starts playing, we remove the upload, error, and progress components -->
      <ng-wistia-video on-play="videoPlaying = true"></ng-wistia-video>

    </ng-wistia>

### Independent Video Player

Using the `video-id` attribute of `ng-wistia-video`, any independent video can be played directly. Note that `video-id` is the `hashed_id` of a video on Wistia (e.g. **1iuyx2yvow**):

    <ng-wistia api-password="************">
      <ng-wistia-video style="width: 100%; height: 400px; display: block;" video-id="*****"></ng-wistia-video>
    </ng-wistia>


## Requirements

* [jQuery](https://jquery.com/) v. 1.6+
* [blueimp-file-upload](https://github.com/blueimp/jQuery-File-Upload) v. 9+








